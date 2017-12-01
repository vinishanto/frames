(function($){

    var pluginName = 'Frames',
        defaults = {
            'total_frames': 31, //total no of frames
            'frame_rate': 40,   //frame rate in milliseconds
            'auto_start': true,      //start the frame animation
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        console.log('new plugin change...');
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }

    Plugin.prototype.init = function () {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options
        if(this.options.auto_start){
            this._create_frames();
            this._run();
        }
    };

    Plugin.prototype._render_frames = function(n){
        obj = this;
        setTimeout(function(){
            if(n <= obj.options.total_frames){
                $(obj.element).data('frames')[n](this);
                obj._render_frames( n+1 );
            }
        }, this.options.frame_rate)
    }

    Plugin.prototype._run = function(){
        obj = this;
        this.runner = setInterval(function(){
            if (!$(obj.element).data('frames_paused'))
                obj._render_frames(1);
        }, (this.options.total_frames * this.options.frame_rate));
    }
    
    Plugin.prototype._create_frames = function(){
        frames = []
        for(i=1; i <= this.options.total_frames; i++){
            frames[i] = function(el){
            }
        }
        $(this.element).data('frames', frames);
        $(this.element).data('frames_paused', false)
    }

    Plugin.prototype.pause = function(){
        $(this.element).data('frames_paused', true);
    }

    Plugin.prototype.resume = function(){
        $(this.element).data('frames_paused', false);
    }

    Plugin.prototype._destroy = function(){
        $(this.element).data('frames_paused', null);
        $(this.element).data('frames', null);
    }

    $.fn[pluginName] = function(options){
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, 
                    new Plugin( this, options ));
                }
            });
        }
        else if(typeof options === 'string' && options[0] !== '_' && options !== 'init'){
            var returns;
            returns = this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (!instance) {
                    //initializing with empty option asssuming it dont have any options
                    instance = $.data(this, 'plugin_' + pluginName, new Plugin(this));
                }

                //vrifiying whether the options given is a function, non private function
                //and calls the function with given args
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }

                //If option is destroy just destroys the plugin from the element(s)
                if (instance instanceof Plugin && options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                    return instance['_destroy'].apply(instance, Array.prototype.slice.call(args, 1));
                    
                }
            });
            return returns !== undefined ? returns : this;
        }
    }
}(jQuery));
