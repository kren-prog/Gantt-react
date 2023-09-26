import React, { Component } from 'react';
import Gantt from './components/Gantt';
import Toolbar from './components/Toolbar';
import MessageArea from './components/MessageArea';
import './App.css';

const data = {
  data: [
    { id: 1, proceso:'CORTE', text: 'Corte', type: "project", render: "split",  open: true,  progress: 0.6, color:"orange"},
    { id: 2, proceso:'MONTAJE', text: 'Montaje', type: "project", render: "split",  open: true, progress: 0.6, color:"red"},
    { id: 3, proceso:'SUBLIMACION', text: 'Sublimacion', type: "project", render: "split",  open: true, progress: 0.6, color:"#03A9F4" },
    { id: 4, proceso:'CONFECCION', text: 'Confeccion', type: "project", render: "split",  open: true, progress: 0.6 },
    { id: 5, proceso:'COR001', maquina:'Equipo trabajo corte', text: 'Task #2', start_date: '2023-02-16', duration: 3, parent: "1", open: true, progress: 0.4 },
    { id: 6, proceso:'MON001', maquina:'CMYK', text: 'Maquina #1', start_date: '2023-02-16', duration: 3, parent: "2", open: true, progress: 0.4 },
    { id: 7, proceso:'MON002', maquina:'VALUEJET', text: 'Maquina #2', type: "project", render: "split", start_date: '2023-02-19', duration: 3, parent: "2", open: true, progress: 0.4 },
    { id: 8, proceso:'MON003', maquina:'PERF', text: 'Maquina #3', type: "project", render: "split",  open: true, parent: "2", progress: 0.4 },
    { id: 9, proceso:'Orden #1', maquina:'Orden #1', text: 'Orden #1', start_date: '2023-02-22', end_date: '2023-02-23 18:00', parent: "8", open: true, progress: 0.4 },
    { id: 10, proceso:'Orden #2', maquina:'Orden #2', text: 'Orden #2', start_date: '2023-02-24', end_date: '2023-02-25 11:30', parent: "8", open: true, progress: 0.4 },
    { id: 11, proceso:'Orden #3', maquina:'Orden #3', text: 'Orden #3', start_date: '2023-02-26', end_date: '2023-02-27',  parent: "8", open: true, progress: 0.4 },

    { id: 13, text: "Task #3", start_date: "2023-02-15 00:00", type: "project", render: "split", progress: 0.5, open: false, duration: 11 },
    { id: 17, text: "Stage #1", start_date: "2023-02-15 00:00", duration: 1, parent: "13", progress: 0, open: true },
    { id: 18, text: "Stage #2", start_date: "2023-02-17 00:00", duration: 2, parent: "13", progress: 0, open: true }
  ],
  links: [
    { id: 1, source: 1, target: 2, type: '0' }
  ]
};
class App extends Component {
  state = {
    currentZoom: 'Days',
    messages: []
  };

  addMessage(message) {
    const maxLogLength = 5;
    const newMessage = { message };
    const messages = [
      newMessage,
      ...this.state.messages
    ];

    if (messages.length > maxLogLength) {
      messages.length = maxLogLength;
    }
    this.setState({ messages });
  }

  logDataUpdate = (type, action, item, id) => {
    let text = item && item.text ? ` (${item.text})` : '';
    let message = `${type} ${action}: ${id} ${text}`;
    if (type === 'link' && action !== 'delete') {
      message += ` ( source: ${item.source}, target: ${item.target} )`;
    }
    this.addMessage(message);
  }

  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom
    });
  }

  render() {
    const { currentZoom, messages } = this.state;
    return (
      <div>
        <div className="zoom-bar">
          <Toolbar
            zoom={currentZoom}
            onZoomChange={this.handleZoomChange}
          />
        </div>
        <div className="row">
          <div className="col-1">
            <button className="btn btn-sm btn-primary" type="button" draggable="true" id="caja">Drag</button>
          </div>
          <div className="col-11 gantt-container">
            <Gantt
              tasks={data}
              zoom={currentZoom}
              onDataUpdated={this.logDataUpdate}
            />
          </div>
        </div>
        <MessageArea
          messages={messages}
        />
      </div>
    );
  }
}

export default App;

