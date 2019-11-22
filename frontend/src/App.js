import React, { Component } from "react";
import store from "./Shared/Store/index";
import { Provider } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "./Components/Modals/Modal";
import DataTable from "./Components/Tables/DataTable";
import { CSVLink } from "react-csv";
import { addCharacter, addRace } from "./Shared/Actions";

class App extends Component {
  state = {
    characters: [],
    races: [],
    loading: true
  };

  async getCharacters() {
    await fetch("http://localhost:3002/characters")
      .then(response => response.json())
      .then(characters => store.dispatch(addCharacter(characters)))
      .catch(err => console.log(err));
  }
  async getRaces() {
    await fetch("http://localhost:3002/races")
      .then(response => response.json())
      .then(races => store.dispatch(addRace(races)))
      .catch(err => console.log(err));
  }

  addItemToState = item => {
    this.setState(prevState => ({
      characters: [...prevState.characters, item]
    }));
  };

  updateState = item => {
    const itemIndex = this.state.characters.findIndex(
      data => data.id === item.id
    );
    const newArray = [
      // destructure all characters from beginning to the indexed item
      ...this.state.characters.slice(0, itemIndex),
      // add the updated item to the array
      item,
      // add the rest of the characters to the array from the index after the replaced item
      ...this.state.characters.slice(itemIndex + 1)
    ];
    this.setState({ characters: newArray });
  };

  deleteItemFromState = id => {
    const updatedcharacters = this.state.characters.filter(
      item => item.id !== id
    );
    this.setState({ characters: updatedcharacters });
  };

  async componentDidMount() {
    this.setState({ loading: true });
    await this.getCharacters();
    await this.getRaces();
    this.setState({ loading: false });
  }

  render() {
    if (!this.state.loading) {
      return (
        <Provider store={store}>
          <Container className="App">
            <Row>
              <Col>
                <h1 style={{ margin: "20px 0" }}>CRUD Database</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <DataTable
                  updateState={this.updateState}
                  deleteItemFromState={this.deleteItemFromState}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <CSVLink
                  filename={"db.csv"}
                  color="primary"
                  style={{ float: "left", marginRight: "10px" }}
                  className="btn btn-primary"
                  data={this.state.characters}
                >
                  Download CSV
                </CSVLink>
                <ModalForm
                  buttonLabel="Add Item"
                  addItemToState={this.addItemToState}
                />
              </Col>
            </Row>
          </Container>
        </Provider>
      );
    } else {
      return <div>Loading</div>;
    }
  }
}

export default App;
