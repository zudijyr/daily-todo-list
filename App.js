import React, { Component } from 'react';
import { Container, Header, Content, ListItem, CheckBox, Text, Body, Form, Input } from 'native-base';
export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = { 
		itemOne: false, itemTwo: false, itemThree: false, itemFour: false, itemFive: false, itemSix: false, itemSeven: false,
		itemSevenText: "Still some tasks remaining"
	}
	this.onCheckPress = this.onCheckPress.bind(this);
  }
  checkCallback() {
	if (this.state.itemOne && this.state.itemTwo && this.state.itemThree
	  && this.state.itemFour && this.state.itemFive && this.state.itemSix) {
		this.setState({ itemSeven: true })
		this.setState({ itemSevenText: "All Done! Congrats!" })
	} else {
		this.setState({ itemSevenText: "Still some tasks remaining" })
	}
  }
  
  onCheckPress(num, item) {
	if (num == 1) {	
		this.setState({ itemOne: !item }, () => this.checkCallback()) ;
	} else if (num == 2) {	
		this.setState({ itemTwo: !item }, () => this.checkCallback()) ;
	} else if (num == 3) {	
		this.setState({ itemThree: !item }, () => this.checkCallback()) ;
	} else if (num == 4) {	
		this.setState({ itemFour: !item }, () => this.checkCallback()) ;
	} else if (num == 5) {	
		this.setState({ itemFive: !item }, () => this.checkCallback()) ;
	} else if (num == 6) {	
		this.setState({ itemSix: !item }, () => this.checkCallback()) ;
	}
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Form>
            <Text>Daily ToDo List</Text>
            <ListItem>
              <CheckBox checked={this.state.itemOne} color="red"
			  	onPress={
					() => this.onCheckPress(1, this.state.itemOne )
				} />
              <Body>
                <Input placeholder= "Aerobic Exercise"
                  onChangeText={(text) => this.setState({ itemOneText: text })}
                  value={this.state.itemOneText} />
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.itemTwo} color="red"
			  	onPress={
					() => this.onCheckPress(2, this.state.itemTwo)
				} />
              <Body>
                <Input placeholder="Anaerobic Exercise"
                  onChangeText={(text) => this.setState({ itemTwoText: text })}
                  value={this.state.itemTwoText} />
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.itemThree} color="blue"
			  	onPress={
					() => this.onCheckPress(3, this.state.itemThree)
				} />
              <Body>
                <Input placeholder="Meditation"
                  onChangeText={(text) => this.setState({ itemThreeText: text })}
                  value={this.state.itemThreeText} />
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.itemFour} color="blue"
			  	onPress={
					() => this.onCheckPress(4, this.state.itemFour)
				} />
              <Body>
                <Input placeholder="Practice Music"
                  onChangeText={(text) => this.setState({ itemFourText: text })}
                  value={this.state.itemFourText} />
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.itemFive} color="green"
			  	onPress={
					() => this.onCheckPress(5, this.state.itemFive)
				} />
              <Body>
                <Input placeholder="Study Foreign Language"
                  onChangeText={(text) => this.setState({ itemFiveText: text })}
                  value={this.state.itemFiveText} />
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.itemSix} color="green"
			  	onPress={
					() => this.onCheckPress(6, this.state.itemSix)
				} />
              <Body>
                <Input placeholder="Study Coding"
                  onChangeText={(text) => this.setState({ itemSixText: text })}
                  value={this.state.itemSixText} />
              </Body>
            </ListItem>
			<ListItem>
			  <CheckBox checked={this.state.itemSeven} color="black"/>
			  <Body>
			    <Text>{this.state.itemSevenText}</Text>
			  </Body>
			</ListItem>
          </Form>
        </Content>
      </Container>
    );
  }
}
