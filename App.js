import React, { Component } from 'react';
import { Container, Header, Content, ListItem, CheckBox, Text, Body, Form, Input } from 'native-base';
export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = { 
		taskBools: [false, false, false, false, false, false],
		isComplete: false,
		isCompleteText: "Still some tasks remaining"
	}
	this.onCheckPress = this.onCheckPress.bind(this);
  }

  checkCallback() {
	if ( this.state.taskBools.every(function(value) { return value == true }) ) {
		this.setState({ isComplete: true });
		this.setState({ isCompleteText: "All Done! Congrats!" });
	} else {
		this.setState({ isComplete: false });
		this.setState({ isCompleteText: "Still some tasks remaining" })
	}
  }
  
  onCheckPress(num, item) {
	let taskBools = [ ...this.state.taskBools ];
		taskBools[num] = !item;
		this.setState({ taskBools }, () => this.checkCallback());
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Form>
            <Text>Daily ToDo List</Text>
            <ListItem>
              <CheckBox checked={this.state.taskBools[0]} color="red"
			  	onPress={
					() => this.onCheckPress(0, this.state.taskBools[0] )
				} />
              <Body>
                <Input placeholder= "Aerobic Exercise"
                  onChangeText={(text) => this.setState({ itemOneText: text })}
                  value={this.state.itemOneText} />
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[1]} color="red"
			  	onPress={
					() => this.onCheckPress(1, this.state.taskBools[1])
				} />
              <Body>
                <Input placeholder="Anaerobic Exercise"
                  onChangeText={(text) => this.setState({ itemTwoText: text })}
                  value={this.state.itemTwoText} />
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[2]} color="blue"
			  	onPress={
					() => this.onCheckPress(2, this.state.taskBools[2])
				} />
              <Body>
                <Input placeholder="Meditation"
                  onChangeText={(text) => this.setState({ itemThreeText: text })}
                  value={this.state.itemThreeText} />
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[3]} color="blue"
			  	onPress={
					() => this.onCheckPress(3, this.state.taskBools[3])
				} />
              <Body>
                <Input placeholder="Practice Music"
                  onChangeText={(text) => this.setState({ itemFourText: text })}
                  value={this.state.itemFourText} />
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[4]} color="green"
			  	onPress={
					() => this.onCheckPress(4, this.state.taskBools[4])
				} />
              <Body>
                <Input placeholder="Study Foreign Language"
                  onChangeText={(text) => this.setState({ itemFiveText: text })}
                  value={this.state.itemFiveText} />
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[5]} color="green"
			  	onPress={
					() => this.onCheckPress(5, this.state.taskBools[5])
				} />
              <Body>
                <Input placeholder="Study Coding"
                  onChangeText={(text) => this.setState({ itemSixText: text })}
                  value={this.state.itemSixText} />
              </Body>
            </ListItem>
			<ListItem>
			  <CheckBox checked={this.state.isComplete} color="black"/>
			  <Body>
			    <Text>{this.state.isCompleteText}</Text>
			  </Body>
			</ListItem>
          </Form>
        </Content>
      </Container>
    );
  }
}
