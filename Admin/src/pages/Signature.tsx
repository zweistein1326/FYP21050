import { useEffect, useState } from "react"
import * as ed from '@noble/ed25519';
import QRCode from 'react-qr-code';
import { privKey, pubKey } from "../utils/keys";
import { MenuItem, Select } from "@mui/material";
import { degrees } from "../utils/degrees";

const Signature = () => {

    const [signature, setSignature] = useState('');
    const [isSignatureValid, setIsSignatureValid] = useState(false);
    const [keypair, setKeypair] = useState({
        privKey: Uint8Array.from([]),
        pubKey: Uint8Array.from([]),
    });

    const [data, setData] = useState({
        'hkid': '',
        'name': '',
        'degree': 'Bachelor',
        'school': 'Medicine',
        'major': 'Dentistry'
    })

    const _handleSchoolChange = (e: any) => {
        setData({...data, school: e.target.value});
    }
    
    const _handleDegreeChange = (e: any) => {
        setData({...data, degree: e.target.value});
    }

    const _handleMajorChange = (e: any) => {
        setData({...data, major: e.target.value});
    }

    useEffect(()=>{
        generateSignature();
    }, [data]);

    const generateSignature = async () => {
        console.log('HELLO');
        let sign_data = {hkid:data.hkid, name: data.name, degree: `${data.degree} of ${data.school} in ${data.major}`};
        const message = new Uint8Array(Buffer.from(JSON.stringify(sign_data)));
        let privateKey = Buffer.from(privKey, 'hex');
        let publicKey = Buffer.from(pubKey, 'hex');
        const signature = await ed.signAsync(message, privateKey);
        const isValid = await ed.verifyAsync(signature,  new Uint8Array(Buffer.from(JSON.stringify(sign_data))), publicKey);
        setSignature(Buffer.from(signature).toString('hex'));
        setIsSignatureValid(isValid);
    }

    return (
        <div style={{padding: 20, maxWidth:'100vw'}}>
            <div>
                <h1>HKU Degree Verification Service</h1>
                <div>
                    <h3>HKID(First 6 digits)</h3>
                    <input value={data.hkid} onChange={(e)=>{setData({...data, hkid: e.target.value})}} />
                </div>
                <div>
                    <h3>Full Name</h3>
                    <input value={data.name} onChange={(e)=>{setData({...data, name: e.target.value})}} />
                </div>
                <div style={{display:'flex', flexDirection:'row', alignItems:'center', gap: 20}}>
                    <div>
                        <h3>Degree</h3>
                        {/* <p>{data.school}</p> */}
                        <Select value={data.degree} onChange={_handleDegreeChange}>
                            {Object.keys(degrees).map((degree: string) => <MenuItem value={degree}>{degree}</MenuItem>)}
                        </Select>
                    </div>
                    {data.degree && <div>
                        <h3>School</h3>
                        {/* <p>{data.school}</p> */}
                        <Select value={data.school} onChange={_handleSchoolChange}>
                            {Object.keys(degrees['Bachelor']).map((school: string) => <MenuItem value={school}>{school}</MenuItem>)}
                        </Select>
                    </div>}
                    {data.school && <div>
                        <h3>Major</h3>
                        {/* <p>{data.major}</p> */}
                        <Select value={data.major} onChange={_handleMajorChange}>
                            {/* @ts-ignore  */}
                            {degrees['Bachelor'][data.school].map((major: string) => <MenuItem value={major}>{major}</MenuItem>)}
                        </Select>
                    </div>}
                </div>
                <p>Data: {JSON.stringify({hkid:data.hkid, name: data.name, degree: `${data.degree} of ${data.school} in ${data.major}`})}</p>
                <p>Signature: {signature}</p>
                {/* <p>Is Data Valid: {isSignatureValid ? 'True' : 'False'}</p> */}
                <QRCode value={`http://192.168.0.196:3000/verify?signature=${signature}&first_name=${data.name.split(' ')[0]}&last_name=${data.name.split(' ')[1]}&degree=000`} />
            </div>
        </div>
    )
}

export default Signature;