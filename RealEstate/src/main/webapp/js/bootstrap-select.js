!function(b){var a=function(d,c,f){if(f){f.stopPropagation();f.preventDefault()}this.$element=b(d);this.$newElement=null;this.button=null;this.options=b.extend({},b.fn.selectpicker.defaults,this.$element.data(),typeof c=="object"&&c);if(this.options.title==null){this.options.title=this.$element.attr("title")}this.val=a.prototype.val;this.render=a.prototype.render;this.refresh=a.prototype.refresh;this.selectAll=a.prototype.selectAll;this.deselectAll=a.prototype.deselectAll;this.init()};a.prototype={constructor:a,init:function(d){if(!this.options.container){this.$element.hide()}else{this.$element.css("visibility","hidden")}this.multiple=this.$element.prop("multiple");var f=this.$element.attr("class")!==undefined?this.$element.attr("class").split(/\s+/):"";var g=this.$element.attr("id");this.$element.after(this.createView());this.$newElement=this.$element.next(".bootstrap-select");if(this.options.container){this.selectPosition()}this.button=this.$newElement.find("> button");if(g!==undefined){this.button.attr("id",g);b('label[for="'+g+'"]').click(b.proxy(this,function(){this.$newElement.find("button#"+g).focus()}))}for(var c=0;c<f.length;c++){if(f[c]!="selectpicker"){this.$newElement.addClass(f[c])}}if(this.multiple){this.$newElement.addClass("show-tick")}this.button.addClass(this.options.style);this.checkDisabled();this.checkTabIndex();this.clickListener();this.$element.bind("DOMNodeInserted DOMNodeRemoved",b.proxy(this.refresh,this));this.render();this.setSize()},createDropdown:function(){var c="<div class='btn-group bootstrap-select'><button type='button' class='btn dropdown-toggle clearfix' data-toggle='dropdown'><span class='filter-option pull-left'></span>&nbsp;<span class='caret'></span></button><ul class='dropdown-menu' role='menu'></ul></div>";return b(c)},createView:function(){var c=this.createDropdown();var d=this.createLi();c.find("ul").append(d);return c},reloadLi:function(){this.destroyLi();$li=this.createLi();this.$newElement.find("ul").append($li)},destroyLi:function(){this.$newElement.find("li").remove()},createLi:function(){var h=this;var e=[];var g=[];var c="";this.$element.find("option").each(function(){e.push(b(this).text())});this.$element.find("option").each(function(l){var p=b(this).attr("class")!==undefined?b(this).attr("class"):"";var o=b(this).text();var n=b(this).data("subtext")!==undefined?'<small class="muted">'+b(this).data("subtext")+"</small>":"";var m=b(this).data("icon")!==undefined?'<i class="'+b(this).data("icon")+'"></i> ':"";if(b(this).is(":disabled")||b(this).parent().is(":disabled")){m="<span>"+m+"</span>"}o=m+'<span class="text">'+o+n+"</span>";if(b(this).parent().is("optgroup")&&b(this).data("divider")!=true){if(b(this).index()==0){var k=b(this).parent().attr("label");var j=b(this).parent().data("subtext")!==undefined?'<small class="muted">'+b(this).parent().data("subtext")+"</small>":"";var i=b(this).parent().data("icon")?'<i class="'+b(this).parent().data("icon")+'"></i> ':"";k=i+'<span class="text">'+k+j+"</span>";if(b(this)[0].index!=0){g.push('<div class="div-contain"><div class="divider"></div></div><dt>'+k+"</dt>"+h.createA(o,"opt "+p))}else{g.push("<dt>"+k+"</dt>"+h.createA(o,"opt "+p))}}else{g.push(h.createA(o,"opt "+p))}}else{if(b(this).data("divider")==true){g.push('<div class="div-contain"><div class="divider"></div></div>')}else{if(b(this).data("hidden")==true){g.push("")}else{g.push(h.createA(o,p))}}}});if(e.length>0){for(var d=0;d<e.length;d++){var f=this.$element.find("option").eq(d);c+="<li rel="+d+">"+g[d]+"</li>"}}if(!this.multiple&&this.$element.find("option:selected").length==0&&!h.options.title){this.$element.find("option").eq(0).prop("selected",true).attr("selected","selected")}return b(c)},createA:function(d,c){return'<a tabindex="-1" href="#" class="'+c+'">'+d+'<i class="icon-ok check-mark"></i></a>'},render:function(){var f=this;this.$element.find("option").each(function(g){f.setDisabled(g,b(this).is(":disabled")||b(this).parent().is(":disabled"));f.setSelected(g,b(this).is(":selected"))});var e=this.$element.find("option:selected").map(function(g,h){if(b(this).attr("title")!=undefined){return b(this).attr("title")}else{return b(this).text()}}).toArray();var d=e.join(", ");if(f.multiple&&f.options.selectedTextFormat.indexOf("count")>-1){var c=f.options.selectedTextFormat.split(">");if((c.length>1&&e.length>c[1])||(c.length==1&&e.length>=2)){d=e.length+" of "+this.$element.find("option").length+" selected"}}if(!d){d=f.options.title!=undefined?f.options.title:f.options.noneSelectedText}f.$newElement.find(".filter-option").html(d)},setSize:function(){var h=this;var d=this.$newElement.find(".dropdown-menu");var j=d.find("li > a");var m=this.$newElement.addClass("open").find(".dropdown-menu li > a").outerHeight();this.$newElement.removeClass("open");var f=d.find("li .divider").outerHeight(true);var e=this.$newElement.offset().top;var i=this.$newElement.outerHeight();var c=parseInt(d.css("padding-top"))+parseInt(d.css("padding-bottom"))+parseInt(d.css("border-top-width"))+parseInt(d.css("border-bottom-width"));if(this.options.size=="auto"){function n(){var o=e-b(window).scrollTop();var r=window.innerHeight;var p=c+parseInt(d.css("margin-top"))+parseInt(d.css("margin-bottom"))+2;var q=r-o-i-p;menuHeight=q;if(h.$newElement.hasClass("dropup")){menuHeight=o-p}if((d.find("li").length+d.find("dt").length)>3){minHeight=m*3+p-2}else{minHeight=0}d.css({"max-height":menuHeight+"px","overflow-y":"auto","min-height":minHeight+"px"})}n();b(window).resize(n);b(window).scroll(n)}else{if(this.options.size&&this.options.size!="auto"&&d.find("li").length>this.options.size){var l=d.find("li > *").filter(":not(.div-contain)").slice(0,this.options.size).last().parent().index();var k=d.find("li").slice(0,l+1).find(".div-contain").length;menuHeight=m*this.options.size+k*f+c;d.css({"max-height":menuHeight+"px","overflow-y":"auto"})}}if(this.options.width=="auto"){this.$newElement.find(".dropdown-menu").css("min-width","0");var g=this.$newElement.find(".dropdown-menu").css("width");this.$newElement.css("width",g);if(this.options.container){this.$element.css("width",g)}}else{if(this.options.width&&this.options.width!="auto"){this.$newElement.css("width",this.options.width);if(this.options.container){this.$element.css("width",this.options.width)}}}},selectPosition:function(){var d=this.$element.offset().top;var c=this.$element.offset().left;this.$newElement.appendTo(this.options.container);this.$newElement.css({position:"absolute",top:d+"px",left:c+"px"})},refresh:function(){this.reloadLi();this.render();this.setSize();this.checkDisabled();if(this.options.container){this.selectPosition()}},setSelected:function(c,d){if(d){this.$newElement.find("li").eq(c).addClass("selected")}else{this.$newElement.find("li").eq(c).removeClass("selected")}},setDisabled:function(c,d){if(d){this.$newElement.find("li").eq(c).addClass("disabled")}else{this.$newElement.find("li").eq(c).removeClass("disabled")}},isDisabled:function(){return this.$element.is(":disabled")||this.$element.attr("readonly")},checkDisabled:function(){if(this.isDisabled()){this.button.addClass("disabled");this.button.click(function(c){c.preventDefault()});this.button.attr("tabindex","-1")}else{if(!this.isDisabled()&&this.button.hasClass("disabled")){this.button.removeClass("disabled");this.button.click(function(){return true});this.button.removeAttr("tabindex")}}},checkTabIndex:function(){if(this.$element.is("[tabindex]")){var c=this.$element.attr("tabindex");this.button.attr("tabindex",c)}},clickListener:function(){var c=this;b("body").on("touchstart.dropdown",".dropdown-menu",function(d){d.stopPropagation()});this.$newElement.on("click","li a",function(j){var g=b(this).parent().index(),i=b(this).parent(),d=i.parents(".bootstrap-select"),h=c.$element.val();if(c.multiple){j.stopPropagation()}j.preventDefault();if(c.$element.not(":disabled")&&!b(this).parent().hasClass("disabled")){if(!c.multiple){c.$element.find("option").removeAttr("selected");c.$element.find("option").eq(g).prop("selected",true).attr("selected","selected")}else{var f=c.$element.find("option").eq(g).prop("selected");if(f){c.$element.find("option").eq(g).removeAttr("selected")}else{c.$element.find("option").eq(g).prop("selected",true).attr("selected","selected")}}d.find(".filter-option").html(i.text());d.find("button").focus();if(h!=c.$element.val()){c.$element.trigger("change")}c.render()}});this.$newElement.on("click","li.disabled a, li dt, li .div-contain",function(d){d.preventDefault();d.stopPropagation();$select=b(this).parent().parents(".bootstrap-select");$select.find("button").focus()});this.$element.on("change",function(d){c.render()})},val:function(c){if(c!=undefined){this.$element.val(c);this.$element.trigger("change");return this.$element}else{return this.$element.val()}},selectAll:function(){this.$element.find("option").prop("selected",true).attr("selected","selected");this.render()},deselectAll:function(){this.$element.find("option").prop("selected",false).removeAttr("selected");this.render()},};b.fn.selectpicker=function(e,f){var c=arguments;var g;var d=this.each(function(){if(b(this).is("select")){var l=b(this),k=l.data("selectpicker"),h=typeof e=="object"&&e;if(!k){l.data("selectpicker",(k=new a(this,h,f)))}else{if(h){for(var j in h){k.options[j]=h[j]}}}if(typeof e=="string"){property=e;if(k[property] instanceof Function){[].shift.apply(c);g=k[property].apply(k,c)}else{g=k.options[property]}}}});if(g!=undefined){return g}else{return d}};b.fn.selectpicker.defaults={style:null,size:"auto",title:null,selectedTextFormat:"values",noneSelectedText:"Nothing selected",width:null,container:false,icon:false}}(window.jQuery);