
const LitElement = Object.getPrototypeOf(
    customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

export class BiAssistantStripCard extends LitElement {
        setConfig(config) {
          this.config = config;
        }
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }
        static get properties() {
            return {
                hass: {},
                config: {},
                over:false,
                x0:false,
                y0:false
            };
        }

        render() {
            
            const state = this.hass.states[this.config.entity];
            const attrs = state.attributes;
            //let isSpleep = attrs['preset_mode'] == 'Sleep'
            
            return html`
            <div id="aspect-ratio" >
              <ha-card id="strip" class="${state.state=='on'||state.state.state=='on'?'active':''}" style="background:${this.config.background_color||''}">
                Test
              </ha-card>
            </div>
            `
          }
          static get styles() {
            return css `
            
            `
          }
          _action(e){
            const target = e.currentTarget;
            
        
            if (!this.config || !this.hass || !target ) {
                return;
            }
            let attr = this.hass.states[this.config.entity].attributes
            let state = this.hass.states[this.config.entity].state
        
            if(target.cmd == "toggle"){
              this.hass.callService('fan', 'toggle', {
                entity_id: this.config.entity
              });
            }else if(target.cmd == "sleep" || target.cmd == "auto" || target.cmd == "favorite"){
              
              this.hass.callService('fan', 'set_preset_mode', {
                entity_id: this.config.entity,
                preset_mode: target.cmd.charAt(0).toUpperCase() + target.cmd.slice(1)
              });
              
            }
          }
          onMouseMove (e) {
          }
          onMouseDown(e){
          }
          onMouseUp(e) {
          }
          
          fire(type, detail, options) {
          
            options = options || {}
            detail = detail === null || detail === undefined ? {} : detail
            const e = new Event(type, {
              bubbles: options.bubbles === undefined ? true : options.bubbles,
              cancelable: Boolean(options.cancelable),
              composed: options.composed === undefined ? true : options.composed,
            })
            
            e.detail = detail
            this.dispatchEvent(e)
            return e
          }
        }
        
        customElements.define('strip-card', BiAssistantStripCard);
        
        export class BiAssistantStripCardEditor extends LitElement {
          setConfig(config) {
            this.config = config;
          }
        
          static get properties() {
              return {
                  hass: {},
                  config: {}
              };
          }
          render() {
            var fanRE = new RegExp("fan\.")
            return html`
            <div class="card-config">
              <paper-input
                  label="${this.hass.localize("ui.panel.lovelace.editor.card.generic.title")} (${this.hass.localize("ui.panel.lovelace.editor.card.config.optional")})"
                  .value="${this.config.name}"
                  .configValue="${"name"}"
                  @value-changed="${this._valueChanged}"
              ></paper-input>
              <div class="side-by-side">
                <paper-input-container>
                    <label slot="label">${this.hass.localize("ui.panel.lovelace.editor.card.generic.aspect_ratio")} (${this.hass.localize("ui.panel.lovelace.editor.card.config.optional")}) ${this.config.aspect_ratio?this.config.aspect_ratio:1}</label>
                    
                    <input type="range" class="aspect_ratio" value="${this.config.aspect_ratio?this.config.aspect_ratio:1}" min="0.3" max="1.0" step="0.01" slot="input" .configValue="${"aspect_ratio"}" @input="${this._valueChanged}">
                </paper-input-container>
        
                <paper-input-container>
                    <label slot="label">
                        Slider option
                    </label>
        
                    <input type="checkbox" 
                        class="slider_option_toggle" 
                        .configValue="${"slider_option"}" 
                        ?checked=${this.config.slider_option}
                        @change="${this._checkedChanged}">
                </paper-input-container>
        
                <paper-input-container>
                    <label slot="label">Background Color</label>
                    <input type="color" value="${this.config.background_color?this.config.background_color:""}" slot="input" .configValue="${"background_color"}" @input="${this._valueChanged}">
                    <ha-icon-button slot="suffix" icon="${this.config.background_color?"mdi:palette":"mdi:palette-outline"}" title="${this.hass.localize("ui.panel.lovelace.editor.card.map.delete")}" .type="${"background_color"}" @click=${this._delEntity}></ha-icon-button>
                </paper-input-container>
              </div>
              <ha-entity-picker
                .label="${this.hass.localize(
                  "ui.panel.lovelace.editor.card.generic.entity"
                )} (${this.hass.localize(
                  "ui.panel.lovelace.editor.card.config.required"
                )})"
                .hass=${this.hass}
                .value=${this.config.entity}
                .configValue=${"entity"}
                .includeDomains=${includeDomains}
                @change=${this._valueChanged}
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            `
          }
          static get styles() {
            return css `
            
            `
          }
          _focusEntity(e){
            // const target = e.target;
            e.target.value = ''
          }
        
          _valueChanged(e){
            const target = e.target;
        
            if (!this.config || !this.hass || !target ) {
                return;
            }
            let configValue = target.configValue
            let newConfig = {
                ...this.config
            };
            console.log(target.value)
                newConfig[configValue] = target.value
            this.configChanged(newConfig)
          }
        
          configChanged(newConfig) {
            const event = new Event("config-changed", {
              bubbles: true,
              composed: true
            });
            event.detail = {config: newConfig};
            this.dispatchEvent(event);
          }
        }
        customElements.define("strip-card-editor", BiAssistantStripCardEditor);
        window.customCards = window.customCards || [];
        window.customCards.push({
          type: "strip-card",
          name: "Strip Card",
          preview: true, 
          description: "Strip Card" // Optional
        });


