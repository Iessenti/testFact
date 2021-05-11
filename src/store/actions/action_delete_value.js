function action_delete_value(value) {
    return { 
        type: 'DELETE_STATE',
        value: value
    }
}

export default action_delete_value;