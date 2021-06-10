import {httpService} from './http.service';

export const activityService = {
    query,
    getById,
    remove,
    save,
};

function query() {
    return httpService.get('activitys');
}

function getById(activityId) {
    return httpService.get(`activitys/${activityId}`);
}

function remove(activityId) {
    return httpService.delete(`activitys/${activityId}`);
}

function save(activity) {
    if (activity._id) {
        return httpService.put(`activitys/${activity._id}`, activity);
    } else {
        return httpService.post(`activitys`, activity);
    }
}