import './App.css';
import React from 'react';
import Modal from "./components/Modal";
import axios from "axios";

const backend_url = "https://germagla.dev/todo-backend";


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            viewCompleted: false,
            toDoList: [],
            modal: false,
            activeItem: {
                title: "",
                description: "",
                completed: false,

            },
        }
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        axios
            .get(`${backend_url}/todos/`)
            .then((res) => {
                this.setState({toDoList: res.data});
                console.log(res.data);
            })
            .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({modal: !this.state.modal});
    };

    handleSubmit = (item) => {
        this.toggle();

        if (item.id) {
            axios
                .put(`${backend_url}/todos/${item.id}/`, item)
                .then(() => this.refreshList());
            return;
        }
        axios
            .post(`${backend_url}/todos/`, item)
            .then(() => this.refreshList());
    };

    handleDelete = (item) => {
        axios
            .delete(`${backend_url}/todos/${item.id}/`)
            .then(() => this.refreshList());
    };

    createItem = () => {
        const item = {title: "", description: "", completed: false};

        this.setState({activeItem: item, modal: !this.state.modal});
    };

    editItem = (item) => {
        this.setState({activeItem: item, modal: !this.state.modal});
    };

    displayCompleted = (status) => status ? this.setState({viewCompleted: true}) : this.setState({viewCompleted: false});

    renderTabList = () => {
        return (
            <div className="nav nav-tabs">
                <span className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
                      onClick={() => this.displayCompleted(true)}>
                    Complete
                </span>
                <span className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
                      onClick={() => this.displayCompleted(false)}>
                    Incomplete
                </span>
            </div>
        )
    };
    renderItems = () => {
        const {viewCompleted} = this.state;
        const newItems = this.state.toDoList.filter(item => item.completed === viewCompleted);
        return newItems.map(item => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}
                      title={item.description}>
                    {item.title}
                </span>
                <span>
                    <button className="btn btn-secondary mr-2" onClick={() => this.editItem(item)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => this.handleDelete(item)}>Delete</button>
                </span>
            </li>
        ))
    };

    render() {
        return (
            <main className="container">
                <h1 className="text-black text-uppercase text-center my-4">To-do App</h1>
                <div className="row">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="mb-4">
                                <button className="btn btn-primary" onClick={() => this.createItem()}>Add Task</button>
                            </div>
                            {this.renderTabList()}
                            <ul className="list-group list-group-flush border-top-0">
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>
                {this.state.modal ? (
                    <Modal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </main>
        );
    }
}



export default App;
