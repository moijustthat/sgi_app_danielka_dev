export const connetor_plugin = (() => {
    const mapping = {
        'AccionText': 'text',
        'Accionqr': 'qr',
        'AccionFontsize': 'fontsize',
        'AccionTextaling': 'textaling',
        'AccionFeed': 'feed',
        'AccionBarcode_ean13': 'barcode_ean13',
        'AccionBarcode_code39': 'barcode_39',
        'AccionBarcode_code128': 'barcode_128',
        'AccionImg_location': 'img_url',
        'AccionCut': 'cut'
    };

    class Operation {
        constructor(action, data) {
            this.action = action + '';
            this.data = data + '';
        }
    }

    class PluginConnector {
        static URL_PLUGIN_POR_DEFECTO = 'http://localhost:4567';
        static Operation = Operation;
        static Constants = mapping;

        constructor(url) {
            this.url = url || PluginConnector.URL_PLUGIN_POR_DEFECTO;
            this.operations = [];
        }

        static obtenerImpresoras(customUrl) {
            if (customUrl) PluginConnector.URL_PLUGIN_POR_DEFECTO = customUrl;
            return fetch(PluginConnector.URL_PLUGIN_POR_DEFECTO + '/getprinters')
                .then(response => response.json());
        }

        text(data) {
            this.operations.push(new PluginConnector.Operation(PluginConnector.Constants['AccionText'], data));
            return this;
        }

        qr(data) {
            this.operations.push(new PluginConnector.Operation(PluginConnector.Constants['Accionqr'], data));
            return this;
        }

        fontsize(data) {
            this.operations.push(new PluginConnector.Operation(PluginConnector.Constants['AccionFontsize'], data));
            return this;
        }

        feed(data) {
            this.operations.push(new PluginConnector.Operation(PluginConnector.Constants['AccionFeed'], data));
            return this;
        }

        textaling(data) {
            this.operations.push(new PluginConnector.Operation(PluginConnector.Constants['AccionTextaling'], data));
            return this;
        }

        barcode_ean13(data) {
            this.operations.push(new PluginConnector.Operation(PluginConnector.Constants['AccionBarcode_ean13'], data));
            return this;
        }

        barcode_39(data) {
            this.operations.push(new PluginConnector.Operation(PluginConnector.Constants['AccionBarcode_code39'], data));
            return this;
        }

        barcode_128(data) {
            this.operations.push(new PluginConnector.Operation(PluginConnector.Constants['AccionBarcode_code128'], data));
            return this;
        }

        img_url(data) {
            this.operations.push(new PluginConnector.Operation(PluginConnector.Constants['AccionImg_location'], data));
            return this;
        }

        cut(data) {
            this.operations.push(new PluginConnector.Operation(PluginConnector.Constants['AccionCut'], data));
            return this;
        }

        async imprimir(nombreImpresora, apiKey) {
            if (nombreImpresora === 'Microsoft Print to PDF') {
                const filePath = prompt('Por favor, introduce la ubicación del archivo:');
                if (!filePath) {
                    throw new Error('La ubicación del archivo es necesaria.');
                }
                nombreImpresora = `Microsoft Print to PDF (${filePath})`;
            }

            const body = {
                operaciones: this.operations,
                nombre_impresora: nombreImpresora,
                api_key: apiKey
            };

            const response = await fetch(this.url + '/imprimir', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            return await response.json();
        }
    }

    return PluginConnector;
})();