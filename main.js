'use strict'
var App = {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

(function (App, $) {
	var doc,
		_$container,
		buffer,
		id = 0;

	App.init = function(){
		doc = document;
		_$container = $('#toDoApp');
		_$container.click($.proxy(this.onClickFunc, this));
		_$container.dblclick($.proxy(this.onDblClickFunc, this));
		_$container.keydown($.proxy(this.onKeyDown, this));
		_$container.focusout($.proxy(this.onFocusOut, this));
		
	};

	App.onFocusOut = function(e){
		if(e.target.hasAttribute('data-keypress-action')){
			switch(e.target.getAttribute('data-keypress-action')){
				case 'changeTask': this.notChangeTask(e); break;    //Если теряеться фокус то возвращаем предведущее значение
			}
		}
	};

	App.onClickFunc = function(e){
		if(e.target.hasAttribute('data-click-action')){
			switch(e.target.getAttribute('data-click-action')){
				case 'clearChecked': this.clearChecked(e); break;
				case 'removeTask': this.removeTask(e); break;
				case 'toggleTask': this.toggleTask(e); break;
				case 'allChecked': this.allChecked(e); break;
			}
		}
	};

	App.onDblClickFunc = function(e){
		console.log(3);
		if(e.target.hasAttribute('data-dblclick-action')){
			switch(e.target.getAttribute('data-dblclick-action')){
				case 'editTask': this.editTask(e); break;
			}
		}
	};

	App.onKeyDown = function(e){
		if(e.target.hasAttribute('data-keypress-action')){
			switch(e.target.getAttribute('data-keypress-action')){
				case 'addTask': {
					if(e.which === ENTER_KEY) {
						this.addTask(e); 
					}
				}
				break;
				case 'changeTask': {
					if(e.which === ENTER_KEY) {
						this.changeTask(e); 
					}
					if (e.which === ESC_KEY) {
						this.notChangeTask(e);
					}
				} break;
			}
		}
	};

	App.toggleTask = function(e){
		if(e.target.checked) {
			var flagCheck = true;
			$(e.target).next().addClass('checkedTask');
			$('ul#toDoList li').each(function(){
				if(!$(this).children('[type=checkbox]').prop('checked')) flagCheck = false; 
			});
			if(flagCheck) {
				$('#allChecked').prop('checked', true);
			}
		}
		else {
			$(e.target).next().removeClass('checkedTask');
			$('#allChecked').prop('checked', false);
		}
	};

	App.allChecked = function(e){
		if(e.target.checked) {
			$('ul#toDoList li').each(function(){
				$(this).children('[type=checkbox]').prop('checked', true);
				$(this).children('label.task').addClass('checkedTask'); 
			});
		}
		else {
			$('ul#toDoList li').each(function(){
				$(this).children('[type=checkbox]').prop('checked', false);
				$(this).children('label.task').removeClass('checkedTask');
			});
		}
	};

	App.addTask = function(e){
		var $toDoList = $('#toDoList'),
			newTaskId = this.nextId(),
			$newTask = $('<li id ="' + newTaskId + '">'),
			taskData = $('#' + e.target.id).val();

		if(taskData){

			$newTask.append('<input type="checkbox" class="toggle" data-click-action="toggleTask">');
			$newTask.append('<label class="task" data-dblclick-action="editTask" data-keypress-action="changeTask">' + taskData + '</label>');
			$newTask.append('<input type="text" class="task edit" data-dblclick-action="editTask" data-task-id="' + newTaskId + '" data-keypress-action="changeTask" value="' + taskData + '"">');
			$newTask.append('<input type="button" value="✗" class="remove" data-click-action="removeTask" data-task-id="' + newTaskId + '">');
			//$newTask.append('<button class="remove" data-click-action="removeTask" data-task-id="' + newTaskId + '"></button>');

			$toDoList.append($newTask);

			$newTask.children('[type=text]').hide();
			$(e.target).val('');
			$('#allChecked').prop('checked', false);
		}
	};

	App.removeTask = function(e){
		$('#' + $(e.target).attr('data-task-id')).remove();
	};

	App.clearChecked = function(e){
		var $checkedBoxes = $('#toDoList li .toggle:checked');
		
		$checkedBoxes.parent().remove();

		$('#allChecked').prop('checked', false);
	};

	App.editTask = function(e){
		buffer = $(e.target).text();
		$(e.target).hide();
		$(e.target).next().show().val(buffer).focus();
	};

	App.changeTask = function(e){
		if(!$(e.target).val()) 
			$('#' + $(e.target).attr('data-task-id')).remove();	         //Если оставили поле задания пустым то удаляем задание
		else 
			buffer	= $(e.target).val();	
		$(e.target).hide();
		$(e.target).prev().text(buffer).show();
	};

	App.notChangeTask = function(e){
		$(e.target).hide();
		$(e.target).prev().text(buffer).show();
	};

	App.nextId = function(){
		return 'id' + id++;
	};
})(App, jQuery);
