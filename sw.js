/*
v1.2
*/
//jQuery Extend
jQuery.fn.extend({
	serializeForm: function(){
		var data=$(this).serializeArray();
		var form={};
		for(var i=0;i<data.length;i++)
			form[data[i].name] = data[i].value;
		return form;
	},
	changeVal:function (v) {
		return $(this).val(v).trigger("change");
	},
	app: function(){
		return $(this).each(function(){
			//this.ex = new EX(this, $(this).data('ex'));
			var $this = $(this);
			var appData = $this.data('app');
			for(var i in appData){
				if(!App.exists(i))
					continue;
				var a = new App[i];
				a.node = this;
				a.obj = $(this);
				a.dt = appData[i];
				a.run();
			}
		});
	},
	appFind: function(){
		return $(this).find("[data-app]").app();
	}
});


//Applications Shell
App = new function(){
	this.exists = function(app){
		return !!this[app];
	};
	this.cli = function(c){
		var p = this.parse(c), app = p['$0'];
		if(this.exists(app))
			return (new this[app]).run(p);
		else
			this.error('App "'+c+'" not created.');
	};
	this.create = function(name, proto){
		if(typeof name == 'string' && typeof proto === 'object'){
			proto.name = name;
		}else proto = name;
		if(proto.name && !this[proto.name]){
			var a = proto.construct || function(){};
			if(typeof proto.run != 'function')
				proto.run = function(){};
			a.prototype = proto;
			this[proto.name] = a;
			return true;
		}else{
			this.error('App name not implemented.');
			return false;
		}

	};
	this.error = function(m){
		console.log(m);
	};
	this.parse = function(c){
		var strs = c.match(/"(^".+)"/g), S='$S',
		 c = c.replace(/"(^".+)"/g, S),
		 args = c.split(' '), l = args.length,
		 res = {$0: args[0]}, flag = false;

		for(var i=1;i<l;i++){
			var p, v=true, raw=args[i];
			if(raw[0]=='-'){
				var s=raw.split('=', 2);
				p=s[0].substring(1);
				if(p[0] == '-'){
					p=p.substring(1);
					if(s.length == 2)
						v=s[1];
				}else{
					var n=0;
					if(s.length==1)
						while(p[n]){
							res[flag=p[n]] = true;
							n++;
						}

					continue;
				}
			}else if(flag){
				v=raw;
				p=flag;
				flag=false;
			}
			if(v==S){
				v=strs[0];
				strs=strs.shift();
			}else if($.isNumeric(v)){
				v=parseFloat(v);
			}
			res[p]=v;
		}
		return res;
	};
}();