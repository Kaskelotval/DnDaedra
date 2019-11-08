import React from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";

class AddEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: -1,
      name: "",
      level: "",
      selected_race: "",
      races: [],
      raceDropdownOpen: false
    };
  }

  onChange = e => {
    console.log("onChange: ", this.state);
    this.setState({ [e.target.name]: e.target.value });
  };

  getRaces = () => {
    console.log("fetching races");
    fetch("http://localhost:3002/races")
      .then(response => response.json())
      .then(items => this.setState({ races: items }))
      .catch(err => console.log(err));
  };

  submitFormAdd = e => {
    console.log("Adding: " + this.state.name);
    e.preventDefault();
    fetch("http://localhost:3002/characters", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.name,
        level: this.state.level,
        race_id: this.state.selected_race.race_id
      })
    })
      .then(response => response.json())
      .then(item => {
        console.log("item: ", item);
        if (item.item) {
          this.props.addItemToState(item.item);
          this.props.toggle();
        } else {
          console.log("failure");
        }
      })
      .catch(err => console.log(err));
  };

  submitFormEdit = e => {
    console.log("character:", this.state);
    e.preventDefault();
    fetch("http://localhost:3002/characters", {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: this.state.id,
        name: this.state.name,
        level: this.state.level,
        race_id: this.state.selected_race.race_id
      })
    })
      .then(response => response.json())
      .then(item => {
        if (Array.isArray(item)) {
          // console.log(item[0])
          this.props.updateState(item[0]);
          this.props.toggle();
        } else {
          console.log("failure");
        }
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    // if item exists, populate the state with proper data
    if (this.props.item) {
      console.log("compo", this.props.item);
      const { id, name, level } = this.props.item;
      this.setState({ id, name, level });
    }
    this.getRaces();
    console.log("races: ", this.state.races);
  }

  toggleRaceDropdown = () => {
    console.log("toggleRaceDropdown: ", this.state);
    this.setState({
      raceDropdownOpen: !this.state.raceDropdownOpen
    });
  };
  selectRace = event => {
    console.log(event.target.id);
    this.setState({
      selected_race: this.state.races[event.target.id - 1]
    });
  };

  render() {
    return (
      <Form
        onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}
      >
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            onChange={this.onChange}
            value={this.state.name === null ? "" : this.state.name}
          />
        </FormGroup>
        <FormGroup>
          <Label for="level">Level</Label>
          <Input
            type="text"
            name="level"
            id="level"
            onChange={this.onChange}
            value={this.state.level === null ? "" : this.state.level}
          />
        </FormGroup>
        <FormGroup>
          <Label for="race">Race</Label>
          <Dropdown
            isOpen={this.state.raceDropdownOpen}
            toggle={this.toggleRaceDropdown}
          >
            <DropdownToggle caret>
              {this.state.selected_race
                ? this.state.selected_race.name
                : "Choose Race"}
            </DropdownToggle>
            <DropdownMenu>
              {this.state.races ? (
                this.state.races.map(race => (
                  <DropdownItem
                    onClick={this.selectRace}
                    id={race.race_id}
                    key={race.race_id}
                  >
                    {race.name}
                  </DropdownItem>
                ))
              ) : (
                <DropdownItem>Empty</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </FormGroup>
        <div>
          {this.state.selected_race ? this.state.selected_race.description : ""}
        </div>{" "}
        <Button>Submit</Button>
      </Form>
    );
  }
}

export default AddEditForm;
