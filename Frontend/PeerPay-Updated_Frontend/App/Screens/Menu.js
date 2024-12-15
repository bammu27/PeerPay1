import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

function HomeScreen({ navigation }) {
    const images = [
        { id: '1', source: require('../assets/image1.jpeg') },
        { id: '2', source: require('../assets/image2.jpeg') },
        { id: '3', source: require('../assets/image3.jpeg') },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Profile')}>
                    <Image
                        source={require('../assets/profile.png')}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('AboutUs')}>
                    <Image
                        source={require('../assets/AboutUs.png')}
                        style={styles.supportImage}
                    />
                </TouchableOpacity>
            </View>

            {/* Slider */}
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                <View style={styles.imageWrapper}>
                    <Image source={images[currentIndex].source} style={styles.sliderImage} />
                </View>
            </ScrollView>

            {/* Grid Container with icons */}
            <View style={styles.gridContainer}>
                <View style={styles.containerItem}>
                    <TouchableOpacity onPress={() => navigation.navigate('PeerList')}>
                        <Icon name="users" size={30} color="#6200EE" />
                        <Text style={styles.containerText}>Peer List</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerItem}>
                    <Text style={styles.containerText}>
                        Account Balance:{"\n"}
                        <Text style={styles.balanceText}>20000</Text>
                    </Text>
                </View>

                <View style={styles.containerItem}>
                    <TouchableOpacity onPress={() => navigation.navigate('Send')}>
                        <Icon name="send" size={30} color="#6200EE" />
                        <Text style={styles.containerText}>Send</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerItem}>
                    <TouchableOpacity onPress={() => navigation.navigate('Receiver')}>
                        <Icon name="credit-card" size={30} color="#6200EE" />
                        <Text style={styles.containerText}>Request</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('PanVerify')}>
                    <Text style={styles.bottomButtonText}>PanVerify</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('AadharVerify')}>
                    <Text style={styles.bottomButtonText}>Adarverify</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Notifications')}>
                    <Icon name="bell" size={20} color="#6200EE" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('PasswordCreate')}>
                    <Text style={styles.bottomButtonText}>Set Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Support')}>
                    <Text style={styles.bottomButtonText}>Support</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#6200EE',
    },
    supportImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#6200EE',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    containerItem: {
        width: '45%',
        height: 150,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 20,
        padding: 10,
    },
    containerText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Roboto',
    },
    balanceText: {
        color: '#6200EE',
        fontWeight: 'bold',
        fontSize: 20,
    },
    link: {
        paddingHorizontal: 15,
    },
    sliderImage: {
        width: 350,
        height: 200,
        borderRadius: 15,
        resizeMode: 'cover',
        alignSelf: 'center',
    },
    imageWrapper: {
        width: '100%',
        height: 200,
        backgroundColor: '#288885',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginVertical: 15,
    },
    bottomNav: {
        
        bottom: 5,
        left: 10,
        right: 10,
        margin:10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 25,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    bottomButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    bottomButtonText: {
        color: '#6200EE',
        fontSize: 14,
        fontWeight: '600',
    },
});


export default HomeScreen;
