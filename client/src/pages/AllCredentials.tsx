import { useState } from "react";
import { connect } from "react-redux"

const AllCredentials = (props:any) => {
    const [credentials,setCredentials] = useState([]);

    const getAllCredentials = ()=>{}

    return(
        <div></div>
    )
}

const mapStateToProps = (state:any) =>({
    auth:state.auth
})

export default connect(mapStateToProps)(AllCredentials);