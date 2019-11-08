import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import ModalForm from "./Components/Modals/Modal";
import DataTable from "./Components/Tables/DataTable";
import { CSVLink } from "react-csv";

class App extends Component {
  state = {
    characters: [],
    races: []
  };

  getCharacters = () => {
    fetch("http://localhost:3002/characters")
      .then(response => response.json())
      .then(characters => this.setState({ characters }))
      .catch(err => console.log(err));
  };
  async getRaces() {
    fetch("http://localhost:3002/races")
      .then(response => response.json())
      .then(races => localStorage.setItem("races", JSON.stringify(races)))
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

  componentDidMount() {
    this.getCharacters();
    this.getRaces();
  }

  render() {
    return (
      <Container className="App">
        <Row>
          <Col>
            <h1 style={{ margin: "20px 0" }}>CRUD Database</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <DataTable
              items={this.state.characters}
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
    );
  }
}

export default App;
