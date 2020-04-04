	window.addEventListener("DOMContentLoaded", function(){

		// different configs for different screen sizes
		var compactView = {
			xy: {
				nav_height: 80
			},
			config: {
				header: {
					rows: [
						{ 
							cols: [
								"prev",
								"date",
								"next",
							]
						},
						{ 
							cols: [
								"day",
								"week",
								"month",
								"spacer",
								"today"
							]
						}
					]
				}
			},
			templates: {
				month_scale_date: scheduler.date.date_to_str("%D"),
				week_scale_date: scheduler.date.date_to_str("%D, %j"),
				event_bar_date: function(start,end,ev) {
					return "";
				}
				
			}
		};
		var fullView = {
			xy: {
				nav_height: 80
			},
			config: {
				header: [
					"day",
					"week",
					"month",
					"date",
					"prev",
					"today",
					"next"
				]
			},
			templates: {
				month_scale_date: scheduler.date.date_to_str("%l"),
				week_scale_date: scheduler.date.date_to_str("%l, %F %j"),
				event_bar_date: function(start,end,ev) {
					return "• <b>"+scheduler.templates.event_date(start)+"</b> ";
				}
			}
		};

		function resetConfig(){
			var settings;
			if(window.innerWidth < 1000){
				settings = compactView;
			}else{
				settings = fullView;
			
			}
			scheduler.utils.mixin(scheduler.config, settings.config, true);
			scheduler.utils.mixin(scheduler.templates, settings.templates, true);
			scheduler.utils.mixin(scheduler.xy, settings.xy, true);
			return true;
		}

		scheduler.config.responsive_lightbox = true;
		resetConfig();
		scheduler.attachEvent("onBeforeViewChange", resetConfig);
		scheduler.attachEvent("onSchedulerResize", resetConfig);


		// demo data
		var alert_opts = [
			{ key: 1, label: 'None' },
			{ key: 2, label: 'On start date' },
			{ key: 3, label: '1 day before' }
		];

		var users = [
			{ key: 1, label: 'George' },
			{ key: 2, label: 'Nataly' },
			{ key: 3, label: 'Diana' }
		];

		scheduler.locale.labels.section_text = 'Text';
		scheduler.locale.labels.section_time = 'Time';
		scheduler.locale.labels.section_select = 'Alert';
		scheduler.locale.labels.section_template = 'Details';
		scheduler.locale.labels.section_userselect = "Participants";
		scheduler.locale.labels.section_fruitselect = "Fruits";
		scheduler.locale.labels.section_checkme = "Check me";
		scheduler.locale.labels.section_priority = 'Priority';

		scheduler.config.lightbox.sections=[
			{ name:"text", height:35, map_to:"text", type:"textarea" , focus:true },
			{ name:"userselect", height: 35, map_to:"user_id", type:"multiselect", options: users, vertical:false },
			{ name:"select", height:35, map_to:"type", type:"select", options:alert_opts},
			{ name:"recurring", height:115, type:"recurring", map_to:"rec_type", button:"recurring"},
			{ name:"time", height:40, type:"time", map_to:"auto" },
		];

		scheduler.init('scheduler_here',new Date(2018,0,1),"week");
		scheduler.load("../common/events.json");

		document.querySelector(".add_event_button").addEventListener("click", function(){
			scheduler.addEventNow();
		});
	});

