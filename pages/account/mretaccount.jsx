import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { Layout } from 'components/account';
import { userService, alertService } from 'services';
import {mretsService} from "../../services/mrets.service";

export default Mretaccount;

function Mretaccount() {
    const router = useRouter();

    // form validation rules
    const validationSchema = Yup.object().shape({
        accountName: Yup.string().required('Account Name is required'),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ accountName }) {
        const user = localStorage.getItem('user');
        const account = mretsService.createAccount(user)
            .then(() => {
                alertService.success('MRETS Account Creation', { keepAfterRouteChange: true });
                const returnUrl = router.query.returnUrl || '/';
                router.push(returnUrl);
            })
            .catch(alertService.error);

        //alertService.success('Account ID' + account.json().data.id);
    }

    return (

            <div className="card">
                <h4 className="card-header">MRET Accounts</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Account Name:</label>
                            <input name="accountName" type="text" {...register('accountName')} className={`form-control ${errors.accountName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.accountName?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Create MRET Account
                        </button>
                    </form>
                </div>
            </div>
    );
}
