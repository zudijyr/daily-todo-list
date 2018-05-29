import React, { Component } from 'react';
import { Container, Header, Content, ListItem, CheckBox, Text, Body, Form, Input } from 'native-base';
export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = { itemOne: false, itemTwo: false, itemThree: false, itemFour: false, itemFive: false, itemSix: false }
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Form>
            <Text>Daily ToDo List</Text>
            <ListItem onPress={() => this.setState({ itemOne: !this.state.itemOne })}>
              <CheckBox checked={this.state.itemOne} color="red"
			  	onPress={() => this.setState({ itemOne: !this.state.itemOne })} />
              <Body>
                <Input placeholder= "Aerobic Exercise"
                  onChangeText={(text) => this.setState({ itemOneText: text })}
                  value={this.state.itemOneText} />
              </Body>
            </ListItem>
            <ListItem onPress={() => this.setState({ itemTwo: !this.state.itemTwo })} >
              <CheckBox checked={this.state.itemTwo} color="red"
			  	onPress={() => this.setState({ itemTwo: !this.state.itemTwo })} />
              <Body>
                <Input placeholder="Anaerobic Exercise"
                  onChangeText={(text) => this.setState({ itemTwoText: text })}
                  value={this.state.itemTwoText} />
              </Body>
            </ListItem>
            <ListItem onPress={() => this.setState({ itemThree: !this.state.itemThree })}>
              <CheckBox checked={this.state.itemThree}
			    onPress={() => this.setState({ itemThree: !this.state.itemThree })} />
              <Body>
                <Input placeholder="Meditation"
                  onChangeText={(text) => this.setState({ itemThreeText: text })}
                  value={this.state.itemThreeText} />
              </Body>
            </ListItem>
            <ListItem onPress={() => this.setState({ itemFour: !this.state.itemFour })}>
              <CheckBox checked={this.state.itemFour}
			    color="blue" onPress={() => this.setState({ itemFour: !this.state.itemFour })} />
              <Body>
                <Input placeholder="Practice Music"
                  onChangeText={(text) => this.setState({ itemFourText: text })}
                  value={this.state.itemFourText} />
              </Body>
            </ListItem>
            <ListItem onPress={() => this.setState({ itemFive: !this.state.itemFour })}>
              <CheckBox checked={this.state.itemFive}
			    color="green" onPress={() => this.setState({ itemFive: !this.state.itemFive })} />
              <Body>
                <Input placeholder="Study Foreign Language"
                  onChangeText={(text) => this.setState({ itemFiveText: text })}
                  value={this.state.itemFiveText} />
              </Body>
            </ListItem>
            <ListItem onPress={() => this.setState({ itemSix: !this.state.itemSix })}>
              <CheckBox checked={this.state.itemSix} color="green"
			  	onPress={() => this.setState({ itemSix: !this.state.itemSix })} />
              <Body>
                <Input placeholder="Study Coding"
                  onChangeText={(text) => this.setState({ itemSixText: text })}
                  value={this.state.itemSixText} />
              </Body>
            </ListItem>
          </Form>
        </Content>
      </Container>
    );
  }
}
