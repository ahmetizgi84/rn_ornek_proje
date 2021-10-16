import { useContext } from "react";

import { Context as AuthContext } from "../context/AuthContext";

export default () => {
    const { _checkingForAuth } = useContext(AuthContext);

    const checkForSession = async () => {
        const response = await _checkingForAuth();
        return response;
    };

    return [checkForSession];
};