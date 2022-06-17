import {mretsService} from "../../services/mrets.service";
import {alertService, userService} from "../../services";
import {Link, Spinner} from "../../components";
import {useState, useEffect} from "react";
import {Layout} from "../../components/users";
import { fetchMrets } from 'helpers/fetch-mrets';

export default Organizations;

function Organizations() {

    const [organizations, setOrganizations] = useState(null);
    const [contact, setContact] = useState(null);
    useEffect(() => {
         mretsService.getOrganizationList().then(x => setOrganizations(x));
    }, []);

    useEffect(() => {
  //      const jsonContacts = getContacts();
  //      jsonContacts.forEach(x => setContact(x));
  //       const con = fetchMrets.get('https://api-sandbox.mrets.org/v1/public/rec/organizations/01de67b2-918f-44e1-8072-187230336a8c/contact');
  //       console.log(con);
    }, []);

    const orgs = localStorage.getItem('organizations');
    const getCons = getContacts(JSON.parse(orgs));
    for (var key in getCons) {
        console.log(key);
    }
    function getContacts(orgs) {
        var contacts =[];
        for (var key in orgs) {
            contacts.push(orgs[key]);
        }
        return contacts;
    }

return (
    <Layout>
        <label>Organizations:</label>
        <table className="table table-striped">
            <thead>
            <tr>
                <th style={{ width: '20%' }}>Organization Name</th>
                <th style={{ width: '20%' }}>Resource Type</th>
                <th style={{ width: '20%' }}>Organization Type</th>
                <th style={{ width: '20%' }}>Region</th>
                <th style={{ width: '20%' }}>API Org Contact</th>
                <th style={{ width: '20%' }}>Contact Name</th>
                <th style={{ width: '20%' }}>City</th>
                <th style={{ width: '20%' }}>State or Province</th>
                <th style={{ width: '20%' }}>Postal Code</th>
                <th style={{ width: '20%' }}>Country</th>
            </tr>
            </thead>
            <tbody>
            {organizations && organizations.data.map(organizations =>
                <tr key={organizations.id}>
                    <td>{organizations.attributes.name}</td>
                    <td>{organizations.attributes.resource_type}</td>
                    <td>{organizations.attributes.organization_type}</td>
                    <td>{organizations.attributes.region}</td>
                    <td>{organizations.relationships.contact.links.related}</td>
                    var orgs = JSON.parse(organizations);
                    for (var org in organizations) {
                        var obj = org;
                         for (var key in obj){
                             var value = obj[key];
                              document.write("<br> - " + key + ": " + value);
                         }
                    }
                    )}
                    {contact && contact.data.map(contact =>
                    <td key={contact.id}>
                        <td>{contact.attributes.name}</td>
                        <td>{contact.attributes.city}</td>
                        <td>{contact.attributes.state_province}</td>
                        <td>{contact.attributes.postal_code}</td>
                        <td>{contact.attributes.country}</td>
                    </td>
                    )}
                </tr>
                    )}
            {!organizations &&
                <tr>
                    <td colSpan="4">
                        <Spinner />
                    </td>
                </tr>
            }
            {organizations && !organizations.data &&
                <tr>
                    <td colSpan="4" className="text-center">
                        <div className="p-2">No Organizations To Display</div>
                    </td>
                </tr>
            }
            </tbody>
        </table>
    </Layout>
    );
}