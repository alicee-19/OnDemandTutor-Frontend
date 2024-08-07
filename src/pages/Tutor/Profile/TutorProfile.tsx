import { useEffect, useState } from 'react'
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useAuth from '../../../hooks/useAuth';
import { getTutorById, getTutorMonthlyStatistic, getTutorStatistic } from '../../../utils/tutorAPI';
import { Certificate, Details, Education } from './TutorProfile.type';
import { Avatar, Button, Col, DatePicker, Flex, Radio, Row, Skeleton, Spin, Tag, Typography, notification } from 'antd';
import * as Style from './TutorProfile.styled';
import Container from '../../../components/Container';
import { UserOutlined } from '@ant-design/icons';

import { getTutorEducation } from '../../../utils/tutorAPI';
import TableComponent from './DisplayComponent/Table/Table';
import { getTutorCertification } from '../../../utils/tutorAPI';
import EducationForm from './FormComponent/EducationForm';
import CertificationForm from './FormComponent/CertificationForm';
import ScheduleForm from './FormComponent/ScheduleForm';
import DescriptionForm from './FormComponent/DescriptionForm';
import AddTimeslot from './FormComponent/AddTimeslot';
import DisplaySchedule from './DisplayComponent/DisplaySchedule';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const { Title, Paragraph, Text } = Typography;

const TutorProfile = () => {
    useDocumentTitle('Tutor Profile | MyTutor');
    const [tutorDetails, setTutorDetails] = useState<Details>();
    const [tutorEducation, setTutorEducation] = useState<Education[]>();
    const [tutorCert, setTutorCert] = useState<Certificate[]>();
    const [api, contextHolder] = notification.useNotification({
        top: 100,
    });
    const [update, isUpdate] = useState<boolean>(false);
    const [updateEducation, isUpdateEducation] = useState<boolean>(false);
    const [updateCert, isUpdateCert] = useState<boolean>(false);
    const [updateSchedule, isUpdateSchedule] = useState<boolean>(false);
    const { user, role, status } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [monthlyLoading, setMonthlyLoading] = useState<boolean>(false);
    const [tableDisplay, setTableDisplay] = useState<string>("education");
    const [statistic, setStatistic] = useState<any>([]);
    const [monthlyStat, setMonthlyStat] = useState<any>([]);
    const navigate = useNavigate();

    //---------------------FETCH DATA---------------------
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {

                if (!user || !(role === "TUTOR") || (role === "TUTOR" && status === "PROCESSING")) return;
                const { data } = await getTutorById(user.id);
                await setTutorDetails({
                    backgroundDescription: data.backgroundDescription,
                    teachingPricePerHour: data.teachingPricePerHour,
                    meetingLink: data.meetingLink,
                    videoIntroductionLink: data.videoIntroductionLink,
                    subjects: data.subjects,
                });


                const response = await getTutorStatistic(user.id);
                if (response) {
                    setStatistic(response.data);
                }
            } catch (error: any) {
                api.error({
                    message: 'Error',
                    description: error.response ? error.response.data : error.message,
                });
            } finally {
                isUpdate(false);
                setLoading(false);
            }
        })();
    }, [user, update]);

    // Fetch monthly statistic
    const fetchMonthlyStat = async (month: number, year: number) => {
        try {
            setMonthlyLoading(true);

            if (!user || !(role === "TUTOR")) return;
            const response = await getTutorMonthlyStatistic(user.id, month, year);
            if (response) {
                setMonthlyStat({ ...response.data, month: month, year: year, canGetSalary: salaryState(month, year, response.data.totalIncome) });
            }
        } catch (error: any) {
            api.error({
                message: 'Error',
                description: error.response ? error.response.data : error.message,
            });
        } finally {
            setMonthlyLoading(false);
        }
    }

    useEffect(() => {
        fetchMonthlyStat(dayjs().month() + 1, dayjs().year());
    }, [user]);

    const onMonthlyStatChange = (date: Dayjs) => {
        fetchMonthlyStat(date.month() + 1, date.year());
    }

    const salaryState = (month: number, year: number, salary: number) => {
        if (dayjs().year() === year && dayjs().month() === month - 1) {
            return false;
        }
        console.log(salary);    
        if (salary === 0) {
            return false;
        }

        return true;
    }
 
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        },1000);
    },[updateSchedule]);


    const onWithdrawClick = () => {
        const data = {
            tutorId: user?.id,
            month: monthlyStat.month,
            year: monthlyStat.year
        }
        navigate(config.routes.tutor.withdrawRequest, { state: data });
    }

    // Fetch education
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                if (!user || !(role == "TUTOR")) return;
                const education = (await getTutorEducation(user.id, '')).data;

                await setTutorEducation(
                    education.map((education: any) => ({
                        id: education.id,
                        majorName: education.majorName,
                        specialization: education.specialization,
                        universityName: education.universityName,
                        degreeType: education.degreeType,
                        academicYear: `${education.startYear} - ${education.endYear}`,
                        verified: education.verified ? "Yes" : "No",
                    })));

            } catch (error: any) {
                api.error({
                    message: 'Error',
                    description: error.response ? error.response.data : error.message,
                });
            } finally {
                isUpdateEducation(false);
                setLoading(false);
            }
        })();
    }, [user, updateEducation]);

    // Fetch certification
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                if (!user || !(role == "TUTOR")) return;
                const certificate = (await getTutorCertification(user.id, '')).data;

                await setTutorCert(
                    certificate.map((certificate: any) => ({
                        id: certificate.id,
                        certificateName: certificate.certificateName,
                        description: certificate.description,
                        issuedBy: certificate.issuedBy,
                        issuedYear: certificate.issuedYear,
                        verified: certificate.verified ? "Yes" : "No",
                        subject: certificate.subject !== null ? certificate.subject : "Other",
                    })));

            } catch (error: any) {
                api.error({
                    message: 'Error',
                    description: error.response ? error.response.data : error.message,
                });
            } finally {
                isUpdateCert(false);
                setLoading(false);
            }
        })();
    }, [user, updateCert]);



    return (
        <>
            <Style.ProfileContainer>
                <Container>
                    {contextHolder}
                    <Spin spinning={loading} tip="Loading...">
                        <Flex vertical gap={44}>
                            <Style.ProfileWrapper>
                                <Row gutter={40}>
                                    <Col xl={12} lg={12} sm={24} xs={24}>
                                        <Style.ProfileContent vertical align="center">
                                            {user?.avatarUrl ? (
                                                <Avatar
                                                    src={user?.avatarUrl}
                                                    size={125}
                                                />
                                            ) : (
                                                <Avatar
                                                    icon={<UserOutlined />}
                                                    size={125}
                                                />
                                            )}
                                            <Title level={1}>{user?.fullName}</Title>
                                            <Style.ProfileInfoItem vertical gap={10}>
                                                <Title level={3}>Overview</Title>

                                                <Style.ProfileInfoBox vertical gap={6}>
                                                    <Skeleton loading={loading} paragraph={false}>
                                                        <Flex justify="space-between">
                                                            <Text>Total lessons:</Text>
                                                            <Paragraph>
                                                                <Text>
                                                                    {statistic?.totalLessons ? statistic?.totalLessons : 0}
                                                                </Text>
                                                                <Text>lesson{statistic?.totalLessons > 1 ? 's' : ''}</Text>
                                                            </Paragraph>
                                                        </Flex>

                                                        <Flex justify="space-between">
                                                            <Text>Total students:</Text>

                                                            <Paragraph>
                                                                <Text>
                                                                    {statistic?.totalTaughtStudent ? statistic?.totalTaughtStudent : 0}
                                                                </Text>
                                                                <Text>student{statistic?.totalTaughtStudent > 1 ? 's' : ''}</Text>
                                                            </Paragraph>
                                                        </Flex>

                                                        <Flex justify="space-between">
                                                            <Text>Income made:</Text>

                                                            <Paragraph>
                                                                <Text>
                                                                    {statistic?.totalIncome ? Math.round((statistic?.totalIncome)).toLocaleString('en-US') : 0}
                                                                </Text>
                                                                <Text>VND</Text>
                                                            </Paragraph>
                                                        </Flex>
                                                    </Skeleton>
                                                </Style.ProfileInfoBox>
                                            </Style.ProfileInfoItem>
                                            <Style.ProfileInfoItem vertical gap={10}>
                                                <Flex justify='space-between'>
                                                    <Title level={3}>Monthly</Title>
                                                    <DatePicker
                                                        format='MM/YYYY'
                                                        picker='month'
                                                        style={{ width: '150px' }}
                                                        disabledDate={(current) => current && current > dayjs()}
                                                        onChange={onMonthlyStatChange}
                                                        defaultValue={dayjs()}
                                                    />
                                                </Flex>
                                                <Style.ProfileInfoBox vertical gap={6}>
                                                    <Skeleton loading={monthlyLoading} paragraph={false}>
                                                        <Flex justify="space-between">
                                                            <Text>Total lessons:</Text>

                                                            <Paragraph>
                                                                <Text>
                                                                    {monthlyStat.totalLessons ? monthlyStat.totalLessons : 0}
                                                                </Text>
                                                                <Text>lesson{monthlyStat.totalLessons > 1 ? 's' : ''}</Text>
                                                            </Paragraph>
                                                        </Flex>

                                                        <Flex justify="space-between">
                                                            <Text>Total students:</Text>

                                                            <Paragraph>
                                                                <Text>
                                                                    {monthlyStat.totalTaughtStudent ? monthlyStat.totalTaughtStudent : 0}
                                                                </Text>
                                                                <Text>student{monthlyStat.totalTaughtStudent > 1 ? 's' : ''}</Text>
                                                            </Paragraph>
                                                        </Flex>

                                                        <Flex justify="space-between">
                                                            <Text>Income made:</Text>

                                                            <Paragraph>
                                                                <Text>
                                                                    {monthlyStat?.totalIncome ? Math.round(monthlyStat?.totalIncome).toLocaleString('en-US') : 0}
                                                                </Text>
                                                                <Text>VND</Text>
                                                            </Paragraph>
                                                        </Flex>

                                                        {monthlyStat.canGetSalary &&
                                                            <Flex justify="space-between">
                                                                <Text>Withdraw salary:</Text>

                                                                <Paragraph style={{textAlign:`right`}}>
                                                                    {monthlyStat.withdrawRequestStatus === "notRequested"  ?
                                                                        <Text >
                                                                            <Button onClick={onWithdrawClick} type='link'
                                                                                style={{ fontSize: `1.6rem`, fontWeight: `500`, padding:`0` }}>
                                                                                Withdraw</Button>
                                                                        </Text> : monthlyStat.withdrawRequestStatus === 'REJECTED'? 
                                                                        <Text>
                                                                            <Tag
                                                                            style={{ fontSize: '16px', margin: '0' }}
                                                                            color={'red'}
                                                                        >
                                                                            {monthlyStat.withdrawRequestStatus}
                                                                        </Tag> <br/>
                                                                        <Button onClick={onWithdrawClick} type='link'
                                                                            style={{ fontSize: `1.6rem`, fontWeight: `500`, padding:`0` }}>
                                                                            Withdraw again</Button>
                                                                    </Text> :
                                                                        <Tag
                                                                            style={{ fontSize: '16px', margin: '0' }}
                                                                            color={
                                                                                monthlyStat.withdrawRequestStatus === 'DONE' ? 'green' :
                                                                                    monthlyStat.withdrawRequestStatus === 'PROCESSING' ? 'orange' : ''
                                                                            }
                                                                        >
                                                                            {monthlyStat.withdrawRequestStatus}
                                                                        </Tag>
                                                                    }
                                                                </Paragraph>
                                                            </Flex>}
                                                    </Skeleton>
                                                </Style.ProfileInfoBox>
                                            </Style.ProfileInfoItem>
                                            <Style.ProfileInfoItem vertical gap={10}>
                                                <Title level={3}>Teaching subject</Title>
                                                <Style.ProfileInfoBox vertical gap={6}>
                                                    <Skeleton loading={loading} paragraph={false}>
                                                        <Flex wrap='wrap' justify='flex-start'
                                                            style={{ paddingLeft: `10px` }}>
                                                            {tutorDetails?.subjects.map(
                                                                (subject, index) => (
                                                                    <Text key={index}>{subject}</Text>))}
                                                        </Flex>
                                                    </Skeleton>
                                                </Style.ProfileInfoBox>
                                            </Style.ProfileInfoItem>
                                            <Style.ProfileInfoItem vertical gap={10}>
                                                <Title level={3}>Your schedule</Title>
                                                <Skeleton loading={loading} paragraph={false}>
                                                    {user?.id &&
                                                        (<div style={{ textAlign: `right` }}>
                                                            <DisplaySchedule tutorId={user?.id} update={updateSchedule} />
                                                            <AddTimeslot tutorId={user?.id}
                                                                isUpdate={isUpdateSchedule}
                                                                update={updateSchedule} />
                                                            <ScheduleForm tutorId={user?.id} isUpdate={isUpdateSchedule} /></div>)}
                                                </Skeleton>
                                            </Style.ProfileInfoItem>
                                        </Style.ProfileContent>
                                    </Col>

                                    <Col xl={12} lg={12} sm={24} xs={24}>
                                        <Title level={3}>Tutor details</Title>

                                        {tutorDetails !== undefined && user &&
                                            <DescriptionForm tutorDetails={tutorDetails} tutorId={user?.id} isUpdate={isUpdate} />}
                                    </Col>
                                </Row>
                            </Style.ProfileWrapper>

                            <Style.ProfileWrapper>
                                <Row gutter={40}>
                                    <Col span={24}>
                                        <Skeleton loading={loading} paragraph={false}>
                                            <Flex vertical gap="middle" >
                                                <Radio.Group defaultValue={tableDisplay}
                                                    onChange={(e) => setTableDisplay(e.target.value)}
                                                    buttonStyle="solid">
                                                    <Radio.Button value="education">Diplomas</Radio.Button>
                                                    <Radio.Button value="certificate">Certificates</Radio.Button>
                                                </Radio.Group>
                                            </Flex>
                                            <div style={{ textAlign: `right`, margin: `20px`, overflow: `scroll` }}>
                                                {tableDisplay.includes("education") ? (<>
                                                    <TableComponent dataType={tableDisplay}
                                                        EducationData={tutorEducation} />
                                                    {user?.id && tutorEducation &&
                                                        <EducationForm tutorId={user?.id}
                                                            lastIndex={tutorEducation?.length}
                                                            isUpdate={isUpdateEducation} />}
                                                </>) : <><TableComponent dataType={tableDisplay}
                                                    CertificateData={tutorCert} />
                                                    {user?.id &&
                                                        <CertificationForm tutorId={user?.id}
                                                            lastIndex={tutorCert?.length}
                                                            isUpdate={isUpdateCert} />
                                                    }</>}
                                            </div>
                                        </Skeleton>
                                    </Col>
                                </Row>
                            </Style.ProfileWrapper>
                        </Flex>
                    </Spin>
                </Container>
            </Style.ProfileContainer >
        </>
    )
}

export default TutorProfile