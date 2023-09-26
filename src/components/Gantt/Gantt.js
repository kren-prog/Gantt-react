import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

export default class Gantt extends Component {

  // instance of gantt.dataProcessor
  dataProcessor = null;


  initZoom() {
    gantt.ext.zoom.init({
      levels: [
        {
          name: 'Hours',
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: 'day', step: 1, format: '%d %M' },
            { unit: 'hour', step: 1, format: '%H' }
          ]
        },
        {
          name: 'Days',
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: 'week', step: 1, format: 'Week #%W' },
            { unit: 'day', step: 1, format: '%d %M' }
          ]
        },
        {
          name: 'Months',
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "month", step: 1, format: '%F' },
            { unit: 'week', step: 1, format: '#%W' }
          ]
        }
      ]
    });
  }

  setZoom(value) {
    if (!gantt.ext.zoom.getLevels()) {
      this.initZoom();
    }
    gantt.ext.zoom.setLevel(value);
  }

  initGanttDataProcessor() {
    /**
     * type: "task"|"link"
     * action: "create"|"update"|"delete"
     * item: data object object
     */
    const onDataUpdated = this.props.onDataUpdated;
    this.dataProcessor = gantt.createDataProcessor((type, action, item, id) => {
      return new Promise((resolve, reject) => {
        if (onDataUpdated) {
          onDataUpdated(type, action, item, id);
        }

        // if onDataUpdated changes returns a permanent id of the created item, you can return it from here so dhtmlxGantt could apply it
        // resolve({id: databaseId});
        return resolve();
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.zoom !== nextProps.zoom;
  }
  // Aca va la configuarcion del gantt 
  componentDidMount() {
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;

    gantt.config.fit_tasks = true;
    gantt.config.open_tree_initially = true;


    gantt.config.round_dnd_dates = false;
    //gantt.config.scroll_size = 40;
    //gantt.config.autoscroll = false;
    gantt.plugins({
      tooltip: true
    });
    gantt.config.bar_height = 20;
    gantt.config.row_height = 30;
    gantt.config.columns = [
      { name: "proceso", label: "Procesos", width: "*", tree: true },
      { name: "maquina", label: "Maquina", align: "center" },
      { name: "add", label: "", width: 44 }
    ];
    gantt.config.date_format = "%Y-%m-%d %H:%i";
    gantt.config.open_split_tasks = true;
    gantt.locale.labels.section_priority = "Priority";
    gantt.config.multiselect = true;

    gantt.config.click_drag = {
      callback: this.onDragEnd,
      singleRow: true
    }
    const { tasks } = this.props;
    gantt.init(this.ganttContainer);
    this.initGanttDataProcessor();
    gantt.parse(tasks);
    this.onDragOver(this.ganttContainer);
    this.onMouseOver(this.ganttContainer);

  

    // gantt.attachEvent("onAfterTaskDrag", function (id, mode, e) {
    //   var modes = gantt.config.drag_mode;
    //   if (mode == modes.move) {
    //     if (dragging_task && id == dragging_task) {
    //       var target_index = Math.floor(y_pos / gantt.config.row_height);

    //       var target_task = gantt.getTaskByIndex(target_index - 1);
    //       if (!target_task) target_task = gantt.getTaskByIndex(gantt.getVisibleTaskCount() - 1);

    //       if (target_task.id == id) {
    //         gantt.refreshTask(id)
    //         return true;
    //       }
    //       dragging_task = 0;
    //       gantt.batchUpdate(function () {
    //         var task = gantt.getTask(id);
    //         gantt.moveTask(task.id, gantt.getTaskIndex(target_task.id), target_task.parent)
    //         gantt.updateTask(id)
    //       })

    //       gantt.updateTask(target_task.id)
    //     }
    //     gantt.refreshTask(id)
    //   }
    // });


    // Dibuja la barra mientras se arrastra verticalmente version PRO addTaskLayer

    //

    // var y_pos;
    // gantt.attachEvent("onMouseMove", function (id, e) {
    //   var domHelpers = gantt.utils.dom;
    //   y_pos = domHelpers.getRelativeEventPosition(e, gantt.$task_data).y + gantt.config.row_height;
    // });


    // var dragging_task = 0;
    // //hide the task bar
    // gantt.attachEvent("onBeforeTaskDrag", function (id, mode, e) {
    //   var modes = gantt.config.drag_mode;
    //   if (mode == modes.move) {
    //     dragging_task = id;
    //     gantt.refreshTask(id);
    //   }
    //   return true;
    // });

    // gantt.templates.task_class = function (start, end, task) {
    //   if (dragging_task && task.id == dragging_task) return 'dragging_task';
    // };
  

    //TOOLTIP
    gantt.templates.tooltip_text = function (start, end, task) {
      return "<b>Task:</b> " + task.text + "<br/><b>Duration:</b> " + task.duration;
    };
  }

  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }
  onDragOver(container) {
    container.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
  }
  onMouseOver(container) {
    const gridWidth = gantt.config.grid_width;

    container.addEventListener("drop", function (event) {
      const { x, y } = container.getBoundingClientRect();

      const taskId = gantt.locate(event);
      //gantt.roundDate(startDate)
      const posX = event.clientX - x - gridWidth;
      const posY = event.clientY - y;
      //console.log("x " + x + " posX " + posX + "\n");
      const datePos = gantt.dateFromPos(posX, posY);
      const roundDate = gantt.roundDate(datePos);
      console.log(roundDate);

      var taskId2 = gantt.addTask({
        id: 20,
        text: "Task #5",
        start_date: roundDate,
        duration: 5,
        parent: "8"
      });
    });
  }

  onDragEnd(startPoint, endPoint, startDate, endDate, tasksBetweenDates, tasksInRow) {
    if (tasksInRow.length === 1) {
      var currentTask = tasksInRow[0];
      if (currentTask.type === "project") {
        currentTask.render = "split";
        gantt.addTask({
          text: "Subtask of " + currentTask.text,
          start_date: gantt.roundDate(startDate),
          end_date: gantt.roundDate(endDate)
        }, currentTask.id);
      } else {
        var projectName = "new Project " + currentTask.text;
        var newProject = gantt.addTask({
          text: projectName,
          render: "split",
          type: "project",
        }, currentTask.parent);
        gantt.moveTask(newProject, gantt.getTaskIndex(currentTask.id), gantt.getParent(currentTask.id));
        gantt.moveTask(currentTask.id, 0, newProject);
        gantt.calculateTaskLevel(currentTask)

        var newTask = gantt.addTask({
          text: "Subtask of " + projectName,
          start_date: gantt.roundDate(startDate),
          end_date: gantt.roundDate(endDate)
        }, newProject);
        gantt.calculateTaskLevel(newTask);
      }
    } else if (tasksInRow.length === 0) {
      gantt.createTask({
        text: "New task",
        start_date: gantt.roundDate(startDate),
        end_date: gantt.roundDate(endDate)
      });
    }
  }

 

  ///////////////////

  //dragging_task = 0;



  ///////////////////

  render() {
    const { zoom } = this.props;
    this.setZoom(zoom);
    return (

      <div
        ref={(input) => { this.ganttContainer = input }}
        style={{ width: '100%', height: '100%' }}
      ></div>


    );
  }
}
