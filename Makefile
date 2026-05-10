dev:
	npm run build && docker run -it --rm \
		-p 5678:5678 \
		-v $(PWD):/home/node/.n8n/custom/n8n-nodes-linkup-so \
		-v n8n_data:/home/node/.n8n \
		n8nio/n8n
