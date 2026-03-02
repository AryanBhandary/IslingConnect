import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppLoader from "../../components/AppLoader";
import AppointmentService from "../../services/AppointmentService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BookAppointment() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { department } = route.params || { department: "PAT" };

    const [studentName, setStudentName] = useState("");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) setTime(selectedTime);
    };

    const handleBooking = async () => {
        if (!studentName || !title) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                studentName,
                title,
                date: date.toISOString().split('T')[0],
                time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            };

            const response = department === "PAT"
                ? await AppointmentService.bookPATAppointment(bookingData)
                : await AppointmentService.bookITAppointment(bookingData);

            if (response.status === 201) {
                Alert.alert("Success", `${department} Appointment booked successfully!`, [
                    { text: "OK", onPress: () => navigation.navigate("MainTabs", { screen: "Activity" }) }
                ]);
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to book appointment.";
            Alert.alert("Error", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book {department} Appointment</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Student Name <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={studentName}
                    onChangeText={setStudentName}
                />

                <Text style={styles.label}>Reason / Title <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Project Discussion, Fee Inquiry"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Select Date <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity style={styles.dateTimeInput} onPress={() => setShowDatePicker(true)}>
                    <Text>{date.toLocaleDateString()}</Text>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>

                <Text style={styles.label}>Select Time <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity style={styles.dateTimeInput} onPress={() => setShowTimePicker(true)}>
                    <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    <Ionicons name="time-outline" size={20} color="#666" />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
                )}
                {showTimePicker && (
                    <DateTimePicker value={time} mode="time" display="default" onChange={onTimeChange} />
                )}

                <TouchableOpacity
                    style={[styles.bookButton, loading && { opacity: 0.7 }]}
                    onPress={handleBooking}
                    disabled={loading}
                >
                    {loading ? <AppLoader variant="onBlue" size="small" /> : <Text style={styles.bookButtonText}>Book Appointment</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFF" },
    header: { flexDirection: "row", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#EEE" },
    headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 15 },
    content: { padding: 20 },
    label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 15, color: "#333" },
    required: { color: "red" },
    input: { borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#F9F9F9" },
    dateTimeInput: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 12, backgroundColor: "#F9F9F9" },
    bookButton: { backgroundColor: "#242FA3", borderRadius: 10, padding: 16, alignItems: "center", marginTop: 30 },
    bookButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
