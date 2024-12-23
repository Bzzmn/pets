# Variables
IMAGE_NAME = bzzmn/pets-adoption-api
VERSION = $(shell git describe --tags --always --dirty)
DOCKER_USERNAME = alvaro.acevedo.ing@gmail.com
PORT = 8080
CONTAINER_NAME = pets-api
# Cargar variables de entorno desde .env
-include .env
export $(shell test -f .env && cat .env | grep -v '^#' | xargs)

# Colores para la salida
CYAN = \033[0;36m
GREEN = \033[0;32m
RED = \033[0;31m
YELLOW = \033[0;33m
NC = \033[0m # No Color

.PHONY: help test test-unit test-integration test-stress build push deploy clean run stop logs

# Ayuda por defecto
help:
	@echo "$(CYAN)Makefile para Pets Adoption API$(NC)"
	@echo ""
	@echo "$(YELLOW)Comandos disponibles:$(NC)"
	@echo "  $(GREEN)make test$(NC)              - Ejecuta todas las pruebas"
	@echo "  $(GREEN)make test-unit$(NC)         - Ejecuta pruebas unitarias"
	@echo "  $(GREEN)make test-integration$(NC)  - Ejecuta pruebas de integración"
	@echo "  $(GREEN)make test-stress$(NC)       - Ejecuta pruebas de estrés"
	@echo "  $(GREEN)make build$(NC)             - Construye la imagen de Docker"
	@echo "  $(GREEN)make push$(NC)              - Sube la imagen a DockerHub"
	@echo "  $(GREEN)make deploy$(NC)            - Construye y sube la imagen"
	@echo "  $(GREEN)make run$(NC)               - Ejecuta el contenedor"
	@echo "  $(GREEN)make stop$(NC)              - Detiene el contenedor"
	@echo "  $(GREEN)make logs$(NC)              - Muestra los logs del contenedor"
	@echo "  $(GREEN)make clean$(NC)             - Limpia recursos locales"
	@echo ""
	@echo "$(YELLOW)Variables:$(NC)"
	@echo "  VERSION: $(VERSION)"
	@echo "  IMAGE: $(IMAGE_NAME)"

# Testing
test: kill-port test-integration

# test-unit:
# 	@echo "$(CYAN)Ejecutando pruebas unitarias...$(NC)"
# 	npm run test

test-integration:
	@echo "$(CYAN)Ejecutando pruebas de integración...$(NC)"
	npm run test:integration

# test-stress:
# 	@echo "$(CYAN)Ejecutando pruebas de estrés...$(NC)"
# 	npm run test:stress

# Docker
build:
	@echo "$(CYAN)Construyendo imagen de Docker: $(IMAGE_NAME):$(VERSION)$(NC)"
	docker build -t $(IMAGE_NAME):$(VERSION) .
	docker tag $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):latest

push:
	@echo "$(CYAN)Iniciando sesión en DockerHub...$(NC)"
	@docker login -u $(DOCKER_USERNAME)
	@echo "$(CYAN)Subiendo imagen $(IMAGE_NAME):$(VERSION) a DockerHub...$(NC)"
	docker push $(IMAGE_NAME):$(VERSION)
	docker push $(IMAGE_NAME):latest

deploy: build push
	@echo "$(GREEN)Despliegue completado exitosamente!$(NC)"

# Docker run
run: kill-port
	@echo "$(CYAN)Deteniendo contenedor anterior si existe...$(NC)"
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@echo "$(CYAN)Iniciando contenedor: $(CONTAINER_NAME)$(NC)"
	@docker run -d \
		--name $(CONTAINER_NAME) \
		-p 0.0.0.0:$(PORT):$(PORT) \
		--restart unless-stopped \
		-e NODE_ENV=production \
		-e PORT=$(PORT) \
		$(shell test -f .env && echo "--env-file .env" || echo "") \
		$(IMAGE_NAME):latest
	@echo "$(GREEN)Contenedor iniciado exitosamente!$(NC)"
	@echo "$(YELLOW)Para ver los logs: make logs$(NC)"

# Docker stop
stop:
	@echo "$(CYAN)Deteniendo contenedor: $(CONTAINER_NAME)$(NC)"
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@echo "$(GREEN)Contenedor detenido exitosamente!$(NC)"

# Docker logs
logs:
	@echo "$(CYAN)Mostrando logs de: $(CONTAINER_NAME)$(NC)"
	@docker logs -f $(CONTAINER_NAME)

# Limpieza
clean: stop kill-port
	@echo "$(CYAN)Limpiando recursos...$(NC)"
	docker rmi $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):latest 2>/dev/null || true
	rm -rf node_modules
	rm -rf coverage
	rm -rf artillery/reports
	@echo "$(GREEN)Limpieza completada!$(NC)"

# Verificación de prerrequisitos
verify:
	@echo "$(CYAN)Verificando prerrequisitos...$(NC)"
	@which node > /dev/null || (echo "$(RED)Node.js no está instalado$(NC)" && exit 1)
	@which npm > /dev/null || (echo "$(RED)npm no está instalado$(NC)" && exit 1)
	@which docker > /dev/null || (echo "$(RED)Docker no está instalado$(NC)" && exit 1)
	@echo "$(GREEN)Todos los prerrequisitos están instalados!$(NC)"

# Regla por defecto
.DEFAULT_GOAL := help 

# Utilidades del sistema
kill-port:
	@echo "$(CYAN)Liberando puerto $(PORT)...$(NC)"
	@lsof -ti:$(PORT) | xargs kill -9 2>/dev/null || echo "Puerto $(PORT) ya está libre"