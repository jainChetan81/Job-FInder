import { useReducer, useEffect } from "react";
import axios from "axios";
const BASE_URL =
    "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json";
const ACTIONS = {
    MAKE_REQUEST: "make-request",
    GET_DATA: "get-data",
    ERROR: "error",
    UPDATE_HAS_NEXT_PAGE: "update-has-next-page",
};
const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.MAKE_REQUEST:
            return { loading: true, jobs: [] };
        case ACTIONS.GET_DATA:
            return { ...state, loading: false, jobs: action.payload.jobs };
        case ACTIONS.ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                jobs: [],
            };
        case ACTIONS.UPDATE_HAS_NEXT_PAGE:
            return { ...state, hasNextPage: action.payload.hasNextPage };
        default:
            return state;
    }
};

const useFetchJobs = (params, page) => {
    const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true }); //Todo: didn't understand this
    useEffect(() => {
        //Todo: didn't understand this
        const cancelToken = axios.CancelToken.source(); //Todo: didn't understand this
        dispatch({ type: ACTIONS.MAKE_REQUEST });
        axios
            .get(BASE_URL, {
                //todo:to add params to a url
                params: { markdown: true, page: page, ...params },
            })
            .then((res) => {
                dispatch({
                    type: ACTIONS.GET_DATA,
                    payload: { jobs: res.data },
                });
            })
            .catch((e) => {
                if (axios.isCancel(e)) return;
                dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
            });
        const cancelToken2 = axios.CancelToken.source();
        axios
            .get(BASE_URL, {
                params: { markdown: true, page: page + 1, ...params },
            })
            .then((res) => {
                dispatch({
                    type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
                    payload: { jobs: { hasNextPage: res.data !== 0 } },
                });
            })
            .catch((e) => {
                if (axios.isCancel(e)) return;
                dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
            });
        return () => {
            cancelToken.cancel();
            cancelToken2.cancel();
        };
    }, [params, page]);
    return state;
};

export default useFetchJobs;
