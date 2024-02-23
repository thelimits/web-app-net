import React, { Component } from 'react';
import './App.css'; // Import your existing styles if needed

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      newPlayer: {
        Name: '',
        Age: '',
        BirthPlace: '',
      },
      filter: {
        BirthPlace: '',
      },
    };
  }

  componentDidMount() {
    this.refreshData();
  }

  async refreshData() {
    const { filter } = this.state;
    const birthplaceFilter = filter.BirthPlace.toLowerCase();

    try {
      let apiUrl = 'http://newcorewebservice.somee.com/api/players';

      // If a birthplace filter is specified, append it to the API URL
      if (birthplaceFilter) {
        apiUrl += `?birthplace=${birthplaceFilter}`;
      }

      // Fetch data from your API with the specified birthplace filter
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        this.setState({ datas: data });
      } else {
        console.error('Error fetching data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  handleInputChange = (event, inputType) => {
    const { name, value } = event.target;
    const stateKey = inputType === 'filter' ? 'filter' : 'newPlayer';

    this.setState((prevState) => ({
      [stateKey]: {
        ...prevState[stateKey],
        [name]: value,
      },
    }));
  };

  handleAddPlayer = async (event) => {
    event.preventDefault();
    const { newPlayer } = this.state;

    try {
      // Send POST request to add a new player
      const response = await fetch('http://newcorewebservice.somee.com/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      });

      if (response.ok) {
        // Refresh data after successful addition
        this.refreshData();

        // Clear the form adter submit data
        this.setState({
          newPlayer: {
            Name: '',
            Age: '',
            BirthPlace: '',
          },
        });
      } else {
        console.error('Failed to add player:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  render() {
    const { datas, newPlayer, filter } = this.state;

    // Get unique birthplaces for the dropdown options
    const uniqueBirthplaces = Array.from(
      new Set(datas.map((player) => player.BirthPlace.toLowerCase()))
    );

    return (
      <div className="App">
        <h1 className="table-header">Player Information</h1>

        <div className="form-group">
          <label>
            Filter by BirthPlace:
            <select
              value={filter.BirthPlace}
              onChange={(event) => this.handleInputChange(event, 'filter')}
              name="BirthPlace"
            >
              <option value="">All</option>
              {uniqueBirthplaces.map((place, index) => (
                <option key={index} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </label>
        </div>

        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>BirthPlace</th>
            </tr>
          </thead>
          <tbody>
            {datas
              .filter((player) =>
                filter.BirthPlace === '' ||
                player.BirthPlace.toLowerCase().includes(filter.BirthPlace.toLowerCase())
              )
              .map((data, index) => (
                <tr key={index}>
                  <td>{data.Name}</td>
                  <td>{data.Age}</td>
                  <td>{data.BirthPlace}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div style={{ margin: '20px' }}></div>

        <form onSubmit={this.handleAddPlayer}>
          <div className="form-group">
            <label>
              Name:
              <input
                type="text"
                name="Name"
                value={newPlayer.Name}
                onChange={(event) => this.handleInputChange(event, 'newPlayer')}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Age:
              <input
                type="number"
                name="Age"
                step="1"
                value={newPlayer.Age}
                onChange={(event) => this.handleInputChange(event, 'newPlayer')}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              BirthPlace:
              <input
                type="text"
                name="BirthPlace"
                value={newPlayer.BirthPlace}
                onChange={(event) => this.handleInputChange(event, 'newPlayer')}
              />
            </label>
          </div>

          <button type="submit">Add Player</button>
        </form>
      </div>
    );
  }
}

export default App;
