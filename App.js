import React, { Component } from 'react';
import {
	Container, Header, Content, ListItem, CheckBox, Body, Form, Input
} from 'native-base';
import { Alert,AppState,TouchableOpacity,View, Text, TextInput, FlatList, Button, AsyncStorage } from "react-native";

const incompleteText = "Hang in there";
const completeText = "All Done! Congrats!";
const placeholderText = "Enter new task here";
const levelIncrease = 3;

export default class DailyToDoList extends Component {
  constructor(props) {
    super(props)
    this.state = { 
		keyIndex: 3,
		data: [{key: '0', text: 'Aerobic Exercise', bool: false, taskLevel: 1, taskProgress: 0, taskRemaining: 3},
			   {key: '1', text: 'Practice Coding', bool: false, taskLevel: 1, taskProgress: 0, taskRemaining: 3},
			   {key: '2', text: 'Study Foreign Language', bool: false, taskLevel: 1, taskProgress: 0, taskRemaining: 3},
			],
		isComplete: false,
		isCompleteText: incompleteText,
		completionLevel: 1,
		completionProgress: 0,
		completionRemaining: 3,
		appState: AppState.currentState,
	}
	this.onCheckPress = this.onCheckPress.bind(this);
	this._delete = this._delete.bind(this);
  }

  async storeItem(key, item) {
    try {
      var jsonOfItem = AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.log(error.message);
    }
  }

  makeDate(date_string){
	var day   = parseInt(date_string.substring(8,10));
	var month  = parseInt(date_string.substring(5,7));
	var year   = parseInt(date_string.substring(0,4));
	var date = new Date(year, month-1, day);
	return date;
  }

  getDayDiff(oldDateString, currentDateString) {
	var oldDate = this.makeDate(oldDateString);
	var currentDate = this.makeDate(currentDateString);
	var timeDiff = currentDate.getTime() - oldDate.getTime();
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	if (diffDays < 0) {
		//this shouldn't happen outside of flukey situations like traveling across
		//time zones at midnight, etc
		return 0;
	} else { return diffDays; }
  }

  handleDayChanges() {
	let data = this.state.data;
	let isComplete = this.state.isComplete;
	let completionProgress = this.state.completionProgress;
	let completionRemaining = this.state.completionRemaining;
	var date = new Date();
	var localDateTime = new Date(date.getTime()-date.getTimezoneOffset()*60*1000);
	var localDateString = new Date(localDateTime).toJSON().slice(0, 10);
	//Throwing away time zone info because I want to track days by local time zone, not UTC
    AsyncStorage.getItem('lastDate', (err, lastDate) => {
	  if (!err && lastDate && typeof(lastDate) === 'string' && lastDate !== '' && lastDate != localDateString) {
		  //Adjust and reset if it's a new day
	  	  var dayDiff = this.getDayDiff(lastDate, localDateString);
	  	  for (var i=0, l=data.length; i<l; i++) { 
	  	  	if (!data[i]['bool'] && data[i]['taskProgress'] > 0) { //handle the undone tasks from last day
	  	  	  data[i]['taskProgress']--;
	  	  	  data[i]['taskRemaining']++;
	  	  	}
		  	missedDayChange = Math.min(dayDiff-1, data[i]['taskProgress']) //subtract for days skipped, not counting last day
	  	  	data[i]['taskProgress'] -= missedDayChange;
	  	  	data[i]['taskRemaining'] += missedDayChange;
	  	  }
	  	  if (!isComplete && completionProgress > 0) { //don't penalize for last completed day
		    completionProgress--;
		    completionRemaining++;
		  }
		  isComplete = false;
		  missedDayChange = Math.min(dayDiff-1, completionProgress) //subtract for days skipped, not counting last day
	  	  completionProgress -= missedDayChange;
	  	  completionRemaining += missedDayChange;
		  this.setState({ data }); //now all false
		  this.storeItem('data', data);
		  this.setState({ isComplete, completionProgress, completionRemaining });
		  this.storeItem('isComplete', isComplete);
		  this.storeItem('completionProgress', completionProgress);
		  this.storeItem('completionRemaining', completionRemaining);
	  }
	});
	AsyncStorage.setItem('lastDate', localDateString);
	//debug lines
	//testDateTime = new Date("2018-08-23");
	//testDateString = new Date(testDateTime).toJSON().slice(0, 10);
	//AsyncStorage.setItem('lastDate', testDateString);
  }

  componentDidMount() {
	AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
	AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    this.setState({appState: nextAppState});
	let keys = ['keyIndex', 'data', 'isComplete', 'completionLevel', 'completionProgress', 'completionRemaining'];
	//AsyncStorage.multiRemove(keys, (err) => { }); //For testing
		  
    AsyncStorage.multiGet(keys, (err, results) => {
		for (var i = 0; i < results.length; i++) {
			let key = results[i][0];
			let value = results[i][1];
		    if (typeof(value) === 'string' && value !== '[]') {
		    	if (key == 'keyIndex') { this.setState({ keyIndex: JSON.parse(value) }) }
		    	if (key == 'data') { this.setState({ data: JSON.parse(value) }) }
		    	if (key == 'completionLevel') { this.setState({ completionLevel: JSON.parse(value) }) }
		    	if (key == 'completionProgress') { this.setState({ completionProgress: JSON.parse(value) }) }
		    	if (key == 'completionRemaining') { this.setState({ completionRemaining: JSON.parse(value) }) }
		    	if (key == 'isComplete') { this.setState({ isComplete: JSON.parse(value) }) }
			}
		}
		this.handleDayChanges();
	});
  }

  allCompleteCallback() {
	let tasksComplete = this.state.data.map(a => a.bool);
	let isComplete = this.state.isComplete;
	let completionProgress = this.state.completionProgress;
	let completionRemaining = this.state.completionRemaining;
	let completionLevel = this.state.completionLevel;

	if ( tasksComplete.every(function(value) { return value === true }) && !isComplete) {
		isComplete = true;
		this.setState({ isComplete });
		this.setState({ isCompleteText: completeText });
		completionProgress += 1;
		completionRemaining -= 1;
	} else if (isComplete) {
		isComplete = false;
		this.setState({ isComplete });
		this.setState({ isCompleteText: incompleteText });
		completionProgress -= 1;
		completionRemaining += 1;
	}

	if (completionRemaining === 0) {
		completionLevel += 1;
		completionProgress = 0;
		CompletionRemaining = levelIncrease*completionLevel;
	} else if (completionProgress < 0) { //in case they cancel a level up
		completionLevel -= 1;
		completionRemaining = 1;
		completionProgress = levelIncrease*completionLevel-1;
	}
	this.setState({ completionProgress, completionRemaining, completionLevel });

    this.storeItem('data', this.state.data);
    this.storeItem('keyIndex', this.state.keyIndex);
    this.storeItem('isComplete', isComplete);
    this.storeItem('completionLevel', completionLevel);
    this.storeItem('completionProgress', completionProgress);
    this.storeItem('completionRemaining', completionRemaining);
  }

  onCheckPress(item) {
	item['bool'] = !item['bool'];
	if (item['bool'] === true) {
		item['taskProgress'] += 1;
		item['taskRemaining'] -= 1;
	}
	else if (item['bool'] === false) {
		item['taskProgress'] -= 1;
		item['taskRemaining'] += 1;
	}
	if (item['taskRemaining'] === 0) {
		item['taskLevel'] += 1;
		item['taskProgress'] = 0;
		item['taskRemaining'] = levelIncrease*item['taskLevel'];
	} else if (item['taskProgress'] < 0) { //in case they cancel a level up
		item['taskLevel'] -= 1;
		item['taskRemaining'] = 1;
		item['taskProgress'] = levelIncrease*item['taskLevel']-1;
	}
	this.setState({ item }, () => this.allCompleteCallback()) ;
  }

  _renderItem = ({item}) => (
   <ListItem >
	<View style={{marginRight: 20, flexDirection: 'column', justifyContent: 'center'}}>
	<Text>{item.text}</Text>
	<View style={{marginRight: 20, flexDirection: 'row', alignItems: 'center'}}>
		<CheckBox checked={item.bool} color="green"
			style={{marginRight: 20}}
			onPress={
				() => this.onCheckPress(item)
			} />
		<View style={{marginRight: 20, flexDirection: 'column'}}>
    	<Text>Current level: {item.taskLevel}</Text>
    	<Text>Current progress: {item.taskProgress}</Text>
    	<Text>To next level: {item.taskRemaining}</Text>
		</View>
			<TouchableOpacity>
			<Button
			    title="Delete This Task"
				color="red"
				style={{marginLeft: 10, marginRight: 20, flex: 1}}
				onPress={() => Alert.alert(
				    'Confirm Delete',
				    'This will permanently delete your progress for this task. Are you sure?',
				    [
				      {text: 'OK', onPress: () => this._delete(item)},
				      {text: 'Cancel', },
				    ],
				  )}
			/>
			</TouchableOpacity>
	    </View>
	</View>
   </ListItem>
  );

  _press = () => {
	this.state.data.push({ key: JSON.stringify(this.state.keyIndex),
		text: this.state.newTaskText, bool: false, taskLevel: 1, taskProgress: 0, taskRemaining: levelIncrease}
		);
	this.setState(({ keyIndex }) => ({
	    keyIndex: keyIndex + 1
    }), () => this.allCompleteCallback());
	Alert.alert('Added new task: ' + JSON.stringify(this.state.newTaskText));
  };

  _delete = (item) => {
	let data = this.state.data;
	var index = JSON.stringify(data.indexOf(item));
	if (index > -1) {
	  data.splice(index, 1);
	  this.setState({data}, this.allCompleteCallback());
	}
  };

  render() {
    return (
	<View style={{
			flexDirection: 'column',
			backgroundColor: 'white',
			flex: 1,
	}}>
        <Text>Daily ToDo List</Text>
		<View style={
				{flexDirection: 'row',
				marginLeft: 20,
				marginRight: 20,
				alignItems: 'center'}
				}>
                <TextInput placeholder={placeholderText}
				  placeholderTextColor="grey"
				  underlineColorAndroid='transparent'
                  onChangeText={(text) => this.setState({ newTaskText: text })}
                  value={this.state.newTaskText} 
				  style={{flex: 1, marginRight: 20}} />
			<TouchableOpacity>
			<Button
			    title="Add New Task"
				color="#841584"
				onPress = {this._press}
				style={{flex: 1, marginLeft: 10}}
			/>
			</TouchableOpacity>
		</View>
		<FlatList
		  data={this.state.data}
		  extraData={this.state}
		  renderItem={this._renderItem}
		/>

        <ListItem>
          <CheckBox checked={this.state.isComplete} color="black"
		style={{marginRight: 20}}
		/>
          <Body>
            <Text>Finished all daily tasks</Text>
            <Text>Current level: {this.state.completionLevel}</Text>
            <Text>Current progress: {this.state.completionProgress}</Text>
            <Text>To next level: {this.state.completionRemaining}</Text>
          </Body>
		</ListItem>
	</View>
    );
  }
}
