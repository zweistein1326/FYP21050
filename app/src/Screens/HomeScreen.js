import React from 'react';

const HomeScreen = () => {

    const onFileUpload = (event) => {
        event.preventDefault();
        console.log(event.target.files[0]);
    }

    return (
        <div>
            <input name="file" placeholder='uplaod file' onChange={onFileUpload} type='file' />
        </div>
    )
}

export default HomeScreen;