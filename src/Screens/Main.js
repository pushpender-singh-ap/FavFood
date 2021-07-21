import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Image,
    ActivityIndicator
} from "react-native";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { List } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from 'react-native-animatable';

import AntDesign from 'react-native-vector-icons/AntDesign'

import { GET } from "../Function/Function";

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,

            data: [],
            newsearchdata: [],

            search: ""
        };
    }

    async componentDidMount() {

        let localstore = await AsyncStorage.getItem("data")
        localstore = JSON.parse(localstore);
        if (typeof localstore == "object") {
            this.setState({ data: localstore, loading: false })
        } else {
            let res = await GET("/b/60e7f4ebf72d2b70bbac2970")
            if (res) {
                let data = res.data.data
                this.setState({ data, loading: false })
                try {
                    await AsyncStorage.setItem(
                        'data',
                        JSON.stringify(data)
                    );
                } catch (error) {
                    console.log(error);
                }

            }
        }
    }

    handlePress = () => this.setState({ expanded: !this.state.expanded });

    find = async () => {
        if (this.state.search !== '') {
            try {
                let filterItems = (arr, query) => {
                    return arr.filter((el) => {
                        let value = el.title.toLowerCase().indexOf(query) !== -1
                        return value
                    })
                }
                let data = await filterItems(this.state.data, this.state.search.toLowerCase())
                this.setState({ newsearchdata: data })
            } catch (e) {
                console.log('e1', e);
            }
        }
    }
    render() {
        let data = this.state.search ? this.state.newsearchdata : this.state.data
        return (
            <View style={styles.container}>

                <Animatable.View
                    style={styles.header}
                    animation="bounceInRight"
                >

                    {/* Header */}
                    <Text
                        allowFontScaling={false}
                        style={styles.headerText}>Approved Food Lists</Text>
                </Animatable.View>

                <Animatable.View
                    animation="fadeInDown"
                    style={{
                        flex: 1
                    }} >
                    <View
                        style={styles.SearchStyle}>
                        <TextInput
                            onChangeText={(search) => { this.setState({ search }); this.find() }}
                            value={this.state.search}
                            returnKeyType="search"
                            placeholder="Try search fat, saurces names..."
                            style={{
                                flex: 1,
                                marginLeft: hp('4.5%')
                            }}
                        />

                        <AntDesign
                            name={'search1'}
                            color={'#abb2ba'}
                            size={hp('3.5%')}
                            style={{
                                position: "absolute",
                                marginLeft: hp('1%')
                            }}
                        />
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {data.length !== 0 && !this.state.loading ?
                            data.map((item, index) => (
                                <List.Section
                                    key={index}
                                    style={{
                                        backgroundColor: "#eae9ef"
                                    }}>
                                    <List.Accordion title={item.title}
                                        style={{
                                            backgroundColor: "#FFF"
                                        }}
                                        onPress={this.handlePress}
                                        left={props => <Image
                                            source={{ uri: item.image }}
                                            style={{
                                                height: hp('5%'),
                                                width: hp('5%'),
                                                borderRadius: hp('1%')
                                            }}
                                        />}
                                    >
                                        {item.data.map((inner_item, inner_index) => (
                                            <List.Item
                                                key={inner_index}
                                                title={inner_item.title}
                                                style={{
                                                    backgroundColor: "#FFF",
                                                    marginVertical: hp('1%')
                                                }} />
                                        ))}
                                    </List.Accordion>
                                    <View
                                        style={{
                                            height: hp('0.5%')
                                        }}
                                    />
                                </List.Section>
                            ))
                            :
                            <>
                                {this.state.loading ?
                                    <View style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: hp('2%')
                                    }}>
                                        <Text style={{
                                            marginHorizontal: hp('1%')
                                        }}>Loading</Text>
                                        <ActivityIndicator
                                            size="small"
                                            color="#222"
                                        />
                                    </View>
                                    : null}

                                {(this.state.search && this.state.newsearchdata.length == 0) ?
                                    <View style={{
                                        flex: 1,
                                        alignItems: "center"
                                    }}>
                                        <Text>No data found</Text>
                                    </View>
                                    : null}
                            </>
                        }
                    </ScrollView>

                </Animatable.View>

            </View>
        );
    }
}
export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eae9ef"
    },
    header: {
        paddingHorizontal: hp('2%'),
        marginVertical: hp('1%'),
    },
    headerText: {
        fontSize: hp('3%'),
        color: '#222',
        fontWeight: "bold"
    },
    SearchStyle: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginHorizontal: hp('2%'),
        backgroundColor: "#e8eff7",
        marginVertical: hp('1%'),
        alignItems: "center",
        borderRadius: hp('1%')
    },
});