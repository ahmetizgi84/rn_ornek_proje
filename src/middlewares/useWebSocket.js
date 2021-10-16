import { useContext } from "react";

import { Context as ProTradeContext } from "../context/ProTradeContext";



export default () => {
    const { startWebSocket } = useContext(ProTradeContext);

    const getProTradeSocketData = async () => {
        const response = startWebSocket();
    };


    const controlSocketData = async (data) => {
        console.log("handle receive")
    }


    return [getProTradeSocketData, controlSocketData];
}

