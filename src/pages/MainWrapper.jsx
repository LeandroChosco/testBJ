import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Main from './Main';
import { getLimitsCam } from '../store/actions/cameras.actions';

const MainWrapper = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getLimitsCam());
    }, [dispatch]);

    return (
        <>
            <Main />
        </>
    )
}

export default MainWrapper;