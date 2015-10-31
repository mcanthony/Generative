// ViewTrace.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewTrace() {
	this.time = 0;
	bongiovi.View.call(this, glslify("../shaders/trace.vert"), glslify("../shaders/trace.frag"));
}

var p = ViewTrace.prototype = new bongiovi.View();
p.constructor = ViewTrace;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function() {
	this.time +=.05;
	this.shader.bind();
	this.shader.uniform("resolution", "uniform2fv", [GL.width, GL.height]);
	this.shader.uniform("time", "uniform1f", this.time);
	GL.draw(this.mesh);
};

module.exports = ViewTrace;