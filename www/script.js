
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
class drop{
  constructor(x, y, lifespan, weight){
    this.x = x;
    this.y = y;
    this.lifespan = lifespan;
    this.weight = weight;
    this.life = 0;
    this.alive = true;
    let rand = Math.floor(random(3));
    if(tracker.sound){
      if(rand ==  0) highSound.play();
      else if(rand == 1) mediumSound.play();
      else if(rand == 2) lowSound.play();
    }
  }
  handle(){
    if(this.life <= this.lifespan){
      let opacity = map(this.life, this.lifespan, 0, 0, 1);
      stroke(`rgba(${tracker.stroke[0]}, ${tracker.stroke[1]}, ${tracker.stroke[2]}, ${opacity})`);
      if(tracker.renderMode == 'default'){
        if(tracker.fill == 'none') fill('rgba(255, 255, 255, 0)');
        if(tracker.fill == 'theme'){
          fill(`rgba(${tracker.stroke[0]}, ${tracker.stroke[1]}, ${tracker.stroke[2]}, ${opacity})`)
        }
        if(tracker.mode == 'default') ellipse(this.x, this.y, tracker.speed * this.life);
        else if(tracker.mode == 'square') rect(this.x - ((this.life * tracker.speed)/2), this.y - ((this.life * tracker.speed)/2), tracker.speed * this.life, tracker.speed * this.life);
        else if(tracker.mode == 'triangle') triangle(this.x - (this.life * tracker.speed), this.y - (this.life * tracker.speed), this.x, this.y + (this.life * tracker.speed), this.x + (this.life * tracker.speed), this.y - (this.life * tracker.speed))
      }
      else if(tracker.renderMode == 'webgl'){
        if(tracker.fill == 'none') fill('rgba(255, 255, 255, 0)');
        if(tracker.fill == 'theme'){
          normalMaterial();
          fill(`rgba(${tracker.stroke[0]}, ${tracker.stroke[1]}, ${tracker.stroke[2]}, ${opacity})`);
          // directionalLight(tracker.stroke[0] + 50, tracker.stroke[1] + 50, tracker.stroke[2] + 50, 50);
        }
        if(tracker.mode == 'default'){
          translate(this.x-(windowWidth/2), (this.y-(windowHeight/2)));
          sphere(tracker.speed * this.life);
          translate(-(this.x-(windowWidth/2)), -(this.y-(windowHeight/2)));
        }
        if(tracker.mode == 'square'){
          translate(this.x-(windowWidth/2), (this.y-(windowHeight/2)));
          box(tracker.speed * this.life);
          translate(-(this.x-(windowWidth/2)), -(this.y-(windowHeight/2)));
        }
        if(tracker.mode == 'triangle'){
          translate(this.x-(windowWidth/2), (this.y-(windowHeight/2)));
          cone(tracker.speed * this.life);
          translate(-(this.x-(windowWidth/2)), -(this.y-(windowHeight/2)));
        }
      }
      this.life++;
    }else this.alive = false;
  }
}
class Tracker{
  constructor(){
    this.frequency = 50;
    this.minLifespan = 20;
    this.maxLifespan = 120;
    this.weight = 1;
    this.sound = false;
    this.theme = "pond";
    this.bg = [66, 167, 244];
    this.stroke = [0, 106, 255];
    this.speed = 5;
    this.mode = 'default';
    this.renderMode = 'default';
    this.fill = 'none';
  }
}
tracker = new Tracker
function preload(){
  // highSound = loadSound('sound/high.ogg');
  // mediumSound = loadSound('sound/medium.ogg');
  // lowSound = loadSound('sound/low.ogg');
}
drops = [];
function setup() {
  if(tracker.renderMode == 'default') createCanvas(windowWidth, windowHeight);
  else if(tracker.renderMode == 'webgl') createCanvas(windowWidth, windowHeight, WEBGL);
  const canvas = $('#defaultCanvas0');
  fill(0, 0, 0, 0);
}

function draw(){
  background(tracker.bg[0], tracker.bg[1], tracker.bg[2]);
  for(let i=drops.length-1; i>=0; i--){
    strokeWeight(drops[i].weight);
    drops[i].handle();
    if(!drops[i].alive) drops.splice(i, 1)
  }
  if(tracker.frequency != 0 && Math.floor(random(0, 100 - tracker.frequency)) == 0){
    drops.push(new drop(random(0, windowWidth), random(0, windowHeight), Math.floor(random(tracker.minLifespan, tracker.maxLifespan)), Math.floor(random(1, tracker.weight + 1))));
  }
}

function mouseClicked(){
  drops.push(new drop(mouseX, mouseY, Math.floor(random(tracker.minLifespan, tracker.maxLifespan)), Math.floor(random(1, tracker.weight + 1))));
}

function touchStarted(){
  drops.push(new drop(mouseX, mouseY, Math.floor(random(tracker.minLifespan, tracker.maxLifespan)), Math.floor(random(1, tracker.weight + 1))));
  // return false;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

$(document).ready(function(){
  $('body').css({"background-color": `rgb(${tracker.bg[0]}, ${tracker.bg[1]}, tracker.bg[2])`});
  const gear = $('#gear');
  const settingsDiv = $('#settingsDiv');
  const frequencySlider = $('#frequencySlider');
  const frequencyText = $('#frequencyText');
  const minLifespanSlider = $('#minLifespanSlider');
  const minLifespanText = $('#minLifespanText');
  const maxLifespanSlider = $('#maxLifespanSlider');
  const maxLifespanText = $('#maxLifespanText');
  const weightSlider = $('#weightSlider');
  const weightText = $('#weightText');
  const soundToggle = $('#sound');
  const themeSelector = $('#themeSelector');
  const modeSelector = $('#modeSelector');
  const speedSlider = $('#speedSlider');
  const speedText = $('#speedText');
  const renderModeSelector = $('#renderModeSelector');
  const fillSelector = $('#fillSelector');
  const bgSelector = $('#bgSelector');
  const strokeSelector = $('#strokeSelector');
  const colorPickers = $('.colorSelector');
  const bgWrapper = $('#bgWrapper');
  const strokeWrapper = $('#strokeWrapper');
  frequencySlider.val(tracker.frequency);
  minLifespanSlider.val(tracker.minLifespan);
  maxLifespanSlider.val(tracker.maxLifespan);
  weightSlider.val(tracker.weight);
  speedSlider.val(tracker.speed);
  themeSelector.val('pond');
  modeSelector.val('default');
  renderModeSelector.val(tracker.renderMode);
  fillSelector.val('none');
  bgWrapper.ColorPicker({flat: true, onChange: function(hsb, hex, rgb, el){
    console.log($(el).val());
    rgb = hexToRgb(hex);
    tracker.bg = [rgb['r'], rgb['g'], rgb['b']];
  }});
  strokeWrapper.ColorPicker({flat: true, onSubmit: function(hsb, hex, rgb, el){
    rgb = hexToRgb(hex);
    tracker.stroke = [rgb['r'], rgb['g'], rgb['b']];
  }});
  gear.click(function(){
    if(settingsDiv.css('display') == 'none'){
      settingsDiv.css({'display': 'block'});
      settingsDiv.animate({'opacity': '.4'}, 400);
    }else{
      settingsDiv.animate({'opacity': '0'}, 400);
      setTimeout(function(){
        settingsDiv.css({'display': 'none'});
      }, 400);
    }
  });
  frequencySlider.change(function(){
    tracker.frequency = $(this).val();
    frequencyText.text(tracker.frequency)
  });
  minLifespanSlider.change(function(){
    tracker.minLifespan = $(this).val();
    minLifespanText.text(tracker.minLifespan);
  });
  maxLifespanSlider.change(function(){
    tracker.maxLifespan = $(this).val();
    maxLifespanText.text(tracker.maxLifespan);
  });
  weightSlider.change(function(){
    tracker.weight = $(this).val();
    weightText.text(tracker.weight);
  });
  soundToggle.click(function(){
    $(this).toggleClass('sounding');
    if($(this).hasClass('sounding')){
      soundToggle.attr('src', 'images/soundOn.png');
      tracker.sound = true;
    }else{
      soundToggle.attr('src', 'images/soundOff.png');
      tracker.sound = false;
    }
  });
  themeSelector.change(function(){
    tracker.theme = $(this).val();
    colorPickers.css({'dispaly': 'none'});
    if(tracker.theme == 'pond'){
      tracker.bg = [66, 167, 244];
      tracker.stroke = [0, 106, 255];
    }else if(tracker.theme == 'lava'){
      tracker.bg = [255, 140, 73];
      tracker.stroke = [221, 82, 2];
    }else if(tracker.theme == 'bee'){
      tracker.bg = [255, 255, 0];
      tracker.stroke = [0, 0, 0];
    }else if(tracker.theme == 'black and white'){
      tracker.bg = [255, 255, 255];
      tracker.stroke = [0, 0, 0];
    }else if(tracker.theme == 'custom'){
      colorPickers.css({'display': 'inline-block'});
    }
    $('body').css({"background-color": `rgb(${tracker.bg[0]}, ${tracker.bg[1]}, tracker.bg[2])`});
  });
  modeSelector.change(function(){
    tracker.mode = $(this).val();
  });
  speedSlider.change(function(){
    tracker.speed = $(this).val();
    speedText.text(tracker.speed);
  });
  renderModeSelector.change(function(){
    tracker.renderMode = $(this).val();
    if(tracker.renderMode == 'default') window.location.reload();
    else if(tracker.renderMode == 'webgl') createCanvas(windowWidth, windowHeight, WEBGL);
  });
  fillSelector.change(function(){
    tracker.fill = $(this).val();
  });
  function bgHandle(hsb, hex, rgb, el){
    rgb = hexToRgb($(el).val());
    tracker.bg = [rgb['r'], rgb['g'], rgb['b']];
  };
  function strokeHandle(hsb, hex, rgb, el){
    rgb = hexToRgb($(el).val());
    tracker.stroke = [rgb['r'], rgb['g'], rgb['b']];
  };
});
