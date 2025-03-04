
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
            
            const includeDomains = ["fan"];
            return html`
            <div id="aspect-ratio" 
              style="width:${100*this.config.aspect_ratio||100}%" 
              class="${state.state=='unavailable'||state.state.state=='unavailable'?'offline':''}" 
              @mouseout="${function(){this.over=false}}" 
              @mouseover="${function(){this.over=true}}" 
              @mousemove="${this.onMouseMove}"
              @touchmove="${this.onMouseMove}"
              @mouseup="${this.onMouseUp}"
              @touchend="${this.onMouseUp}">
              <ha-card id="fan" class="${state.state=='on'||state.state.state=='on'?'active':''}" style="background:${this.config.background_color||''}">
                <div id="container">
                  <div class="fanbox ${state.state=='on'||state.state.state=='on'?'active':''}">
                    <div class="blades" style="animation-duration:${nowspeed}s">
                      <div class="b1 ang1"></div>
                      <div class="b2 ang25"></div>
                      <div class="b3 ang49"></div>
                    </div>
                    ${fans.map(i => html`<div class="fan ang${i}"></div>`)}
                    ${fan1s.map(i => html`<div class="fan1 ang${i}"></div>`)}
                    <div class="c2" style="border-color:${FanXiaomiCard.getPMColor(airLevel)}"></div>
                    <div class="c3">
                        <ha-icon id="power" icon="${state.state=='on'||state.state.state=='on'?(isSpleep?'mdi:weather-night':isManual?'mdi:fan-speed-1':'mdi:leaf'):'mdi:power'}" 
                          class="c_icon state show" role="button" tabindex="0" aria-disabled="false" .cmd="${'toggle'}" @click=${this._action}></ha-icon>
                    </div>
                    <div class="c1">
                      <div class="wrapper rightc complete">
                        <div class="circle rightcircle ${filterLevel<20?"red":""}" style="transform:${filterLevel?filterLevel<50?"rotate(-135deg)":"rotate("+(filterLevel/(100/360)-180-135)+"deg)":""}"></div>
                      </div>
                      <div class="wrapper leftc complete">
                        <div class="circle leftcircle ${filterLevel<20?"red":""}" style="transform:${filterLevel?filterLevel<50?"rotate("+(filterLevel/(100/360)-135)+"deg)":"rotate(45deg)":""}"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div id="buttons" class="${this.over || !this.config.slider_option?'show':'hidden'}" style="${!this.config.slider_option?'margin-top:32px;':''}background:${this.config.background_color||'var(--card-background-color)'}">
                  <mwc-icon-button id="block" class="c_icon ${isLock?"active":""}" role="button" tabindex="0" aria-disabled="false" .cmd="${'lock'}" @click=${this._action}>
                    <ha-icon icon="${isLock?"mdi:lock":"mdi:lock-open"}"></ha-icon>
                  </mwc-icon-button>
                  <div class="icon-badge-container c_icon" .cmd="${'manualLevel'}" @click=${this._action}>
                    <mwc-icon-button id="bmanual" class="${isManual?"active":""}" .cmd="${'favorite'}" @click=${this._action}>
                      <ha-icon icon="mdi:fan-speed-1"></ha-icon>
                    </mwc-icon-button>
                    <div class="badge">${parseInt(manualState.state)}</div>
                  </div>
                  <mwc-icon-button id="bsound" class="c_icon ${isSound?"active":""}" role="button" tabindex="0" aria-disabled="false" .cmd="${'sound'}" @click=${this._action}>
                    <ha-icon icon="${isSound?'mdi:volume-high':'mdi:volume-off'}"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button id="bauto" class="c_icon ${isAuto?"active":""}" role="button" tabindex="0" aria-disabled="false" .cmd="${'auto'}" @click=${this._action}>
                    <ha-icon icon="mdi:fan-auto"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button id="bsleep" class="c_icon ${isSpleep?"active":""}" role="button" tabindex="0" aria-disabled="false" .cmd="${'sleep'}" @click=${this._action}>
                    <ha-icon icon="mdi:weather-night"></ha-icon>
                  </mwc-icon-button>
                </div>
                <mwc-slider
                  id="manualSlider" 
                  class="hidden" 
                  pin 
                  min="${manualState.attributes['min']}"
                  max="${manualState.attributes['max']}" 
                  value="${manualState.state}" 
                  step="${manualState.attributes['step']}" 
                  style="background:${this.config.background_color||'var(--card-background-color)'}" 
                  @mousedown=${this._clickSƒlƒider}
                  @change=${this._changeManualLevel}
                ></mwc-slider>
                <div class="header" style="font-size: 9px;" class="${this.over?'hidden':'show'}">   
                    <div class="name">
                      <span class="ellipsis show" style="">${this.config.name}</span>
                    </div>
                </div>
              </ha-card>
            </div>
            `
          }
          static get styles() {
            return css `
            
            `
          }
          _mouseover(e){
            this.over=true;
          }
          _clickSlider(e){
            const target = e.target;
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


