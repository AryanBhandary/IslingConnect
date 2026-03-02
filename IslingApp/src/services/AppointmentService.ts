import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_API_URI } from "../../config";

class AppointmentService {
    private async getHeaders() {
        const token = await AsyncStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    async bookPATAppointment(data: { studentName: string; title: string; date: string; time: string }) {
        const headers = await this.getHeaders();
        return axios.post(`${APP_API_URI}/api/appointments/book/pat`, data, { headers });
    }

    async bookITAppointment(data: { studentName: string; title: string; date: string; time: string }) {
        const headers = await this.getHeaders();
        return axios.post(`${APP_API_URI}/api/appointments/book/it`, data, { headers });
    }

    async getStudentAppointments() {
        const headers = await this.getHeaders();
        return axios.get(`${APP_API_URI}/api/appointments/my-appointments`, { headers });
    }

    async handleReschedule(appointmentId: string, action: "accept" | "cancel") {
        const headers = await this.getHeaders();
        return axios.put(`${APP_API_URI}/api/appointments/reschedule-handle/${appointmentId}`, { action }, { headers });
    }
}

export default new AppointmentService();
