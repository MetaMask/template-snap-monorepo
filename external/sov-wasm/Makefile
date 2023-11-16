PROJECT := $(shell sed -n '0,/name\s*=\s*"\(.*\)"/s/name\s*=\s*"\(.*\)"/\1/p' Cargo.toml)
VERSION := $(shell sed -n '0,/version\s*=\s*"\(.*\)"/s/version\s*=\s*"\(.*\)"/\1/p' Cargo.toml)
FLAGS := RUSTFLAGS="$(RUSTFLAGS) --remap-path-prefix $(HOME)= -C link-args=-zstack-size=65536"
WASM := "target/wasm32-wasi/release/$(shell sed -n '0,/name\s*=\s*"\(.*\)"/s/name\s*=\s*"\(.*\)"/\1/p' Cargo.toml | sed 's/-/_/g').wasm"
WAT := "assets/$(PROJECT)-$(VERSION).wat"
WAT_THIN := "assets/$(PROJECT)-$(VERSION)-thin.wat"
PACKAGE := "assets/$(PROJECT)-$(VERSION).wasm"
PACKAGE_SHORT := "assets/$(PROJECT).wasm"
PACKAGE_OPTIMIZED := "assets/$(PROJECT)-$(VERSION)-initial-optimized.wasm"
PACKAGE_INITIAL_OPTIMIZED := "assets/$(PROJECT)-$(VERSION)-initial-optimized.wasm"
PACKAGE_INITIAL_THIN := "assets/$(PROJECT)-$(VERSION)-initial-thin.wasm"
PACKAGE_RESTORED := "assets/$(PROJECT)-$(VERSION)-restored.wasm"
PACKAGE_RESTORED_OPTIMIZED := "assets/$(PROJECT)-$(VERSION)-restored-optimized.wasm"
PACKAGE_THIN := "assets/$(PROJECT)-$(VERSION)-thin.wasm"

wasm: ## Build the WASM files
	@$(FLAGS) cargo build --release --target wasm32-wasi
	@cp $(WASM) $(PACKAGE)
	@wasm-opt -O4 $(PACKAGE) -o $(PACKAGE_INITIAL_OPTIMIZED)
	@wasm-opt -Oz $(PACKAGE_INITIAL_OPTIMIZED) -o $(PACKAGE_INITIAL_THIN)
	@wasm2wat $(PACKAGE_INITIAL_THIN) -o $(WAT)
	@wat2wasm $(WAT) -o $(PACKAGE_RESTORED)
	@wasm-opt --enable-bulk-memory -O4 $(PACKAGE_RESTORED) -o $(PACKAGE_RESTORED_OPTIMIZED)
	@wasm-opt --enable-bulk-memory -Oz $(PACKAGE_RESTORED_OPTIMIZED) -o $(PACKAGE_THIN)
	@rm $(PACKAGE_INITIAL_OPTIMIZED) \
		$(PACKAGE_INITIAL_THIN) \
		$(WAT) \
		$(PACKAGE_RESTORED) \
		$(PACKAGE_RESTORED_OPTIMIZED)
	@mv $(PACKAGE_THIN) $(PACKAGE_SHORT)
	@rm $(PACKAGE)
	@echo "Package created: $(PACKAGE_SHORT)"

help: ## Display this help screen
	@grep -h \
		-E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: wasm help
