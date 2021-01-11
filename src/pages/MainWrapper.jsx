import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getLimitsCam } from '../store/reducers/Cameras/actions';
import Main from './Main';

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