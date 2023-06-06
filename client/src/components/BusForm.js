import React from 'react'
import { Col, Form, Row, Modal, message } from 'antd'
import { useDispatch } from 'react-redux'
import { axiosInstance } from '../helpers/axiosInstance';
import { HideLoading, ShowLoading} from "../redux/alertsSlice";
import moment from "moment";
import FormItem from 'antd/es/form/FormItem';
function BusForm( {
    showBusForm,
    setShowBusForm,
    type='add',
    getData, 
    selectedBus,
    setSelectedBus
 }) {
    const dispatch=useDispatch();

    const onFinish = async(values)=>{
        try{
            dispatch(ShowLoading())
            let response = null;
            if(type==='add'){
                response = await axiosInstance.post('/api/buses/add-bus',values,
                   // journeyDate : moment(values.journeyDate).format("dd-mm-yyyy"),
                );
            }else{
                response = await axiosInstance.post("/api/buses/update-bus",{
                    ...values,
                    _id: selectedBus._id,
                });
            }
            if(response.data.success){
                message.success(response.data.message);
            }else{
                message.error(response.data.message);
            }
            getData();
            setShowBusForm(false);
            setSelectedBus(null);
            dispatch(HideLoading());
        }catch(error){
            message.error(error.message)
            dispatch(HideLoading());
        }
    };
    return (
    <div>
      <Modal width={800} title={type==="add" ? "Add Bus" : "Update Bus"} visible={showBusForm} onCancel={()=>{setSelectedBus(null); setShowBusForm(false);}} footer={false}>
        <Form layout ="vertical" onFinish={onFinish} 
        initialValues={selectedBus
            //journeyDate: moment(selectedBus?.journeyDate).toDate(),
        
        }>
        <Row gutter={[10,10]}>
            <Col lg={24} xs={24}>
                <Form.Item label="Bus Name" name="name">
                    <input type="text" />
                </Form.Item>
            </Col>
            <Col lg={12} xs={24}>
                <Form.Item label="Bus Number" name="number">
                    <input type="text" />
                </Form.Item>
            </Col>
            <Col lg={12} xs={24}>
                <Form.Item label="Capacity" name="capacity">
                    <input type="text" />
                </Form.Item>
            </Col>
            <Col lg={12} xs={24}>
                <Form.Item label="From" name="from">
                    <input type="text" />
                </Form.Item>
            </Col>
            <Col lg={12} xs={24}>
                <Form.Item label="To" name="to">
                    <input type="text" />
                </Form.Item>
            </Col>

            <Col lg={8} xs={24}>
                <Form.Item label="Journey Date" name="journeyDate">
                    <input type="date" />
                </Form.Item>
            </Col>
            <Col lg={8} xs={24}>
                <Form.Item label="Departure" name="departure">
                    <input type="time" />
                </Form.Item>
            </Col>
            <Col lg={8} xs={24}>
                <Form.Item label="Arrival" name="arrival">
                    <input type="time" />
                </Form.Item>
            </Col>

            <Col lg={12} xs={24}>
                <Form.Item label="Type" name="type">
                    <select name="" id="">
                        <option value="Luxury">Luxury</option>
                        <option value="Deluxe">Deluxe</option>
                    </select>
                </Form.Item>
            </Col>
            <Col lg={12} xs={24}>
                <Form.Item label="Fare" name="fare">
                    <input type="text" />
                </Form.Item>
            </Col>

            <Col lg={12} xs={24}>
                <Form.Item label = 'Status' name='status'>
                    <select name="" id="">
                        <option value="Yet To Start">Yet To Start</option>
                        <option value="Running">Running</option>
                        <option value="Completed">Completed</option>
                    </select>
                </Form.Item>
            </Col>
        </Row>

        <div className='d-flex justify-content-end'>
            <button className='primary-btn' type="submit">Save</button>
        </div>
        </Form>
      </Modal>
    </div>
  )
}

export default BusForm;
