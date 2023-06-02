import { Button, Input, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as ed from '@noble/ed25519';
import { pubKey } from "../utils/keys";
import { degrees } from "../utils/degrees";

const VerifySignature = () => {
    const [searchParams] = useSearchParams();
    const signature = searchParams.get('signature');
    const first_name = searchParams.get('first_name');
    const last_name = searchParams.get('last_name');
    const degree = parseInt((searchParams.get('degree') ?? '000')[0]);
    const school = parseInt((searchParams.get('degree') ?? '000')[1]);
    const major = parseInt((searchParams.get('degree') ?? '000')[2]);

    const [data, setData] = useState({
        'hkid': '',
        'name': `${first_name} ${last_name}`,
        'school': Object.keys(Object.values(degrees)[degree])[school],
        'degree': Object.keys(degrees)[degree],
        'major': Object.values(Object.values(degrees)[degree])[school][major],
    });
    const [isSignatureValid, setIsSignatureValid] = useState(false);

    const _handleSchoolChange = (e: any) => {
        setData({...data, school: e.target.value});
    }
    
    const _handleDegreeChange = (e: any) => {
        setData({...data, degree: e.target.value});
    }

    const _handleMajorChange = (e: any) => {
        setData({...data, major: e.target.value});
    }
    
    const verifySign = async (e: any) => {
        e.preventDefault();
        if(pubKey) {
            if(signature) {
                let publicKey = Buffer.from(pubKey, 'hex');
                try {
                    const isValid = await ed.verifyAsync(new Uint8Array(Buffer.from(signature, 'hex')), new Uint8Array(Buffer.from(JSON.stringify({'hkid': data.hkid, name: data.name, 'degree': `${data.degree} of ${data.school} in ${data.major}`}))), publicKey);
                    alert(isValid ? `Signature Verification Successful` : 'Invalid Signature');
                    setIsSignatureValid(isValid);
                } catch (e) { 
                    console.log(e);
                    alert('Signature: ' + 'Is Invalid');
                }
            } else { 
                alert('No signature found');
            }
        } else {
            alert('No keypair found');
        }
    }

    return (
        <div style={{padding: 20, maxWidth: '100vw', flexWrap:'wrap', wordBreak:'break-all'}}>
            <h1>Verify Signature</h1>
            <div>
                <h3>Signature</h3>
                <p>{signature}</p>
                {/* <Input style={{width:'100%'}} value={signature} onChange={(e)=>{setSignature(e.target.value)}}/> */}
            </div>
            <div>
                <h3>Name</h3>
                <Input style={{width:'100%'}} value={data.name} onChange={(e)=>{setData({...data, name: e.target.value})}}/>
            </div>
            <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap: 2}}>
                <div>
                    <h3>Degree</h3>
                    <p>{data.degree} of {data.school} in {data.major}</p>
                    {/* <Select value={data.degree} onChange={_handleDegreeChange}>
                        {Object.keys(degrees).map((degree: string) => <MenuItem value={degree}>{degree}</MenuItem>)}
                    </Select> */}
                </div>
                {/* {data.degree && <div>
                    <h3>School</h3>
                    <p>{data.school}</p>
                    <Select value={data.school} onChange={_handleSchoolChange}>
                        {Object.keys(degrees['Bachelor']).map((school: string) => <MenuItem value={school}>{school}</MenuItem>)}
                    </Select>
                </div>} */}
                {/* {data.school && <div>
                    <h3>Major</h3>
                    <p>{data.major}</p>
                    <Select value={data.major} onChange={_handleMajorChange}>
                        {degrees['Bachelor']['Engineering'].map((major: string) => <MenuItem value={major}>{major}</MenuItem>)}
                    </Select>
                </div>} */}
            </div>
            <div>
                <h3>HKID (First 6 digits without prefix)</h3>
                <Input style={{width:'100%'}} value={data.hkid} onChange={(e)=>{setData({...data, hkid: e.target.value})}}/>
            </div>
            <div style={{padding: '20px 0'}}>
                <Button variant="contained" onClick={verifySign}>Verify</Button>
            </div>
            <h2>Is Signature Correct: {isSignatureValid ? 'Yes' : 'No'}</h2>
        </div>
    )
}

export default VerifySignature;