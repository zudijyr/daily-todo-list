import React, { Component } from 'react';
import {
	Container, Header, Content, ListItem, CheckBox, Text, Body, Form, Input
} from 'native-base';
import { AsyncStorage } from 'react-native';

const incompleteText = "Hang in there";
const completeText = "All Done! Congrats!";

export default class DailyToDoList extends Component {
  constructor(props) {
    super(props)
    this.state = { 
		taskBools: [false, false, false, false, false, false],
		itemTexts: ['Aerobic Exercise', 'Anaerobic Exercise', 'Meditation',
			'Practice Music', 'Study Foreign Language', 'Study Coding'],
		isComplete: false,
		isCompleteText: incompleteText,
		taskLevels:    [0,0,0,0,0,0,0],
		taskProgress:  [0,0,0,0,0,0,0],
		taskRemaining: [3,3,3,3,3,3,3],
	}
	this.onCheckPress = this.onCheckPress.bind(this);
  }

  async storeItem(key, item) {
    try {
      var jsonOfItem = AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
	//result should be a non-empty string-array of bools
	//taskBools don't won't load status until I add a way to clear them based on date
    //AsyncStorage.getItem('taskBools', (err, result) => {
	//if (!err && result && typeof(result) === 'string' && result !== '[]'){
	//	let taskBools = JSON.parse(result);
	//	this.setState({ taskBools });
	//}
	//});
    AsyncStorage.getItem('taskLevels', (err, result) => {
	if (!err && result && typeof(result) === 'string' && result !== '[]'){
		let taskLevels = JSON.parse(result);
		this.setState({ taskLevels });
	}
	});
    AsyncStorage.getItem('taskProgress', (err, result) => {
	if (!err && result && typeof(result) === 'string' && result !== '[]'){
		let taskProgress = JSON.parse(result);
		this.setState({ taskProgress });
	}
	});
    AsyncStorage.getItem('taskRemaining', (err, result) => {
	if (!err && result && typeof(result) === 'string' && result !== '[]'){
		let taskRemaining = JSON.parse(result);
		this.setState({ taskRemaining });
	}
	});
  }

  checkCallback() {
	let taskProgress = [ ...this.state.taskProgress ];
	let taskRemaining = [ ...this.state.taskRemaining ];
	let isComplete = this.state.isComplete;
	console.log(isComplete);
	console.log(this.state.taskBools);
	if ( this.state.taskBools.every(function(value) { return value === true }) && !isComplete) {
		this.setState({ isComplete: true });
		this.setState({ isCompleteText: completeText });
		taskProgress[6] += 1;
		taskRemaining[6] -= 1;
	} else if (isComplete) {
		this.setState({ isComplete: false });
		this.setState({ isCompleteText: incompleteText });
		taskProgress[6] -= 1;
		taskRemaining[6] += 1;
	}
	this.setState({ taskProgress, taskRemaining }, () => this.levelsCallback(6));
  }

  levelsCallback(num) {
	let thisRemaining = this.state.taskRemaining[num];
	let taskLevels = [ ...this.state.taskLevels ];
	let taskProgress = [ ...this.state.taskProgress ];
	let taskRemaining = [ ...this.state.taskRemaining ];
	if (thisRemaining === 0) {
		taskLevels[num] += 1;
		taskProgress[num] = 0;
		taskRemaining[num] = 7*taskLevels[num];
		this.setState({ taskLevels, taskProgress, taskRemaining });
	} else if (taskProgress[num] < 0) { //in case they cancel a level up
		taskLevels[num] -= 1;
		taskRemaining[num] = 1;
		if (taskLevels[num] === 0) {
			taskProgress[num] = 2;
		} else {
			taskProgress[num] = 7*taskLevels[num]-1;
		}
		this.setState({ taskLevels, taskProgress, taskRemaining });
	}
    this.storeItem('taskProgress', taskProgress);
    this.storeItem('taskLevels', taskLevels);
    this.storeItem('taskRemaining', taskRemaining);
  }
  
  onCheckPress(num, item) {
	let taskBools = [ ...this.state.taskBools ];
	let taskProgress = [ ...this.state.taskProgress ];
	let taskRemaining = [ ...this.state.taskRemaining ];
	taskBools[num] = !item;
	if (taskBools[num] === true) {
		taskProgress[num] += 1;
		taskRemaining[num] -= 1;
	} else if (taskBools[num] === false) {
		taskProgress[num] -= 1;
		taskRemaining[num] += 1;
	}
    //this.storeItem('taskBools', taskBools);
	this.setState({ taskBools }, () => this.checkCallback());
	this.setState({ taskProgress, taskRemaining }, () => this.levelsCallback(num));
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Form>
            <Text>Daily ToDo List</Text>
			<ListItem>
			  <CheckBox checked={this.state.isComplete} color="black"/>
			  <Body>
			    <Text>{this.state.isCompleteText}</Text>
			  </Body>
			</ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[0]} color="red"
			  	onPress={
					() => this.onCheckPress(0, this.state.taskBools[0] )
				} />
              <Body>
                <Input placeholder= {this.state.itemTexts[0]}
                  onChangeText={(text) => this.setState({ itemOneText: text })}
                  value={this.state.itemOneText} />
			      <Text>Current level: {this.state.taskLevels[0]}</Text>
			      <Text>Current progress: {this.state.taskProgress[0]}</Text>
			      <Text>To next level: {this.state.taskRemaining[0]}</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[1]} color="red"
			  	onPress={
					() => this.onCheckPress(1, this.state.taskBools[1])
				} />
              <Body>
                <Input placeholder={this.state.itemTexts[1]}
                  onChangeText={(text) => this.setState({ itemTwoText: text })}
                  value={this.state.itemTwoText} />
			      <Text>Current level: {this.state.taskLevels[1]}</Text>
			      <Text>Current progress: {this.state.taskProgress[1]}</Text>
			      <Text>To next level: {this.state.taskRemaining[1]}</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[2]} color="blue"
			  	onPress={
					() => this.onCheckPress(2, this.state.taskBools[2])
				} />
              <Body>
                <Input placeholder={this.state.itemTexts[2]}
                  onChangeText={(text) => this.setState({ itemThreeText: text })}
                  value={this.state.itemThreeText} />
			      <Text>Current level: {this.state.taskLevels[2]}</Text>
			      <Text>Current progress: {this.state.taskProgress[2]}</Text>
			      <Text>To next level: {this.state.taskRemaining[2]}</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[3]} color="blue"
			  	onPress={
					() => this.onCheckPress(3, this.state.taskBools[3])
				} />
              <Body>
                <Input placeholder={this.state.itemTexts[3]}
                  onChangeText={(text) => this.setState({ itemFourText: text })}
                  value={this.state.itemFourText} />
			      <Text>Current level: {this.state.taskLevels[3]}</Text>
			      <Text>Current progress: {this.state.taskProgress[3]}</Text>
			      <Text>To next level: {this.state.taskRemaining[3]}</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[4]} color="green"
			  	onPress={
					() => this.onCheckPress(4, this.state.taskBools[4])
				} />
              <Body>
                <Input placeholder={this.state.itemTexts[4]}
                  onChangeText={(text) => this.setState({ itemFiveText: text })}
                  value={this.state.itemFiveText} />
			      <Text>Current level: {this.state.taskLevels[4]}</Text>
			      <Text>Current progress: {this.state.taskProgress[4]}</Text>
			      <Text>To next level: {this.state.taskRemaining[4]}</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox checked={this.state.taskBools[5]} color="green"
			  	onPress={
					() => this.onCheckPress(5, this.state.taskBools[5])
				} />
              <Body>
                <Input placeholder={this.state.itemTexts[5]}
                  onChangeText={(text) => this.setState({ itemSixText: text })}
                  value={this.state.itemSixText} />
			      <Text>Current level: {this.state.taskLevels[5]}</Text>
			      <Text>Current progress: {this.state.taskProgress[5]}</Text>
			      <Text>To next level: {this.state.taskRemaining[5]}</Text>
              </Body>
            </ListItem>
			<ListItem>
			  <CheckBox checked={this.state.isComplete} color="black"/>
			  <Body>
			    <Text>Finished all daily tasks</Text>
			    <Text>Current level: {this.state.taskLevels[6]}</Text>
			    <Text>Current progress: {this.state.taskProgress[6]}</Text>
			    <Text>To next level: {this.state.taskRemaining[6]}</Text>
			  </Body>
			</ListItem>
          </Form>
        </Content>
      </Container>
    );
  }
}
