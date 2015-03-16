App.create('barList',{
	construct: function(){
		this.type = 'messages';
		this.icon = 'fa fa-envelope';
		this.label = 'label-success';
		this.main = 
		this.header = $('<li/>', {'class': 'header'});
	},
	run: function(){
		if(!this.container)
			return;
	}
});
$(function(){
	$(document).appFind();

	Main.obj = $('#content');
	Main.pBar = $('<div/>').css({zIndex:1001,position: 'fixed', top:0, left:0, height: 2, width:0, background: 'red'}).appendTo(document.body);
	$('.square').click(function(){
		$('#sw-main').toggleClass('in');
		$('#sw-side').toggleClass('in');
	});
	$('a.jx').click(function(){
		if(!this.post)
			this.post = $('this').data('req');
		
		Main.load(this.href, this.post);
		return false;
	});	
});
Main=new function(){
	this.tabs = [];
	this.load = function(url, req, callback){
		this.progress(60).progress(80);
		this.obj && this.obj.addClass('loading');
		this.pBar && this.pBar.css({display:'block'});
		if(typeof req === 'function'){
			callback=req;
			req=false;
		}
		this.xhr = $.ajax({
			url: url,
			type: req?'POST':'GET',
			dataType: 'html',
			data: req
/** /
			xhrFields: {
				onprogress: function (e) { console.log(e.lengthComputable);
					if (e.lengthComputable){
						console.log(e.loaded / e.total * 100 + '%');
					}
				}
			}
/**/
		}).done(function(data){
			Main.pBar.animate({width: '100%'}, function(){
				$(this).css({width: 0});
			});
			Main.obj.html(data);
		}).fail(function(a,b,c){
			Main.data('<h1>Erro ao carregar a página</h1><p>O erro retornou a seguinte mensagem: <b>'+c+'</b></p>').pBar.stop(true).animate({width: 0});
		})
		return this;
	}
	this.abort = function(){
		if (this.xhr)
			this.xhr.abort();
		this.obj && this.obj.removeClass('loading');
		this.pBar && this.pBar.stop().animate({width: 0}, function(){
			$(this).css({width: 0});
		});
		return this;
	}
	this.progress = function(p){
		this.pBar && this.pBar.animate({width: p + '%'});
		return this;
	}
	this.data = function(d){
		this.obj && this.obj.html(d);
		return this;
	}
};

//#############################

