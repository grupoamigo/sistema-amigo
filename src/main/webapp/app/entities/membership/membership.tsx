import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { openFile, byteSize, Translate, translate, ICrudSearchAction, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './membership.reducer';
import { IMembership } from 'app/shared/model/membership.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IMembershipProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IMembershipState {
  search: string;
}

export class Membership extends React.Component<IMembershipProps, IMembershipState> {
  state: IMembershipState = {
    search: ''
  };

  componentDidMount() {
    this.props.getEntities();
  }

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  };

  clear = () => {
    this.setState({ search: '' }, () => {
      this.props.getEntities();
    });
  };

  handleSearch = event => this.setState({ search: event.target.value });

  render() {
    const { membershipList, match } = this.props;
    return (
      <div>
        <h2 id="membership-heading">
          <Translate contentKey="sistemaAmigoApp.membership.home.title">Memberships</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="sistemaAmigoApp.membership.home.createLabel">Create a new Membership</Translate>
          </Link>
        </h2>
        <Row>
          <Col sm="12">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup>
                  <AvInput
                    type="text"
                    name="search"
                    value={this.state.search}
                    onChange={this.handleSearch}
                    placeholder={translate('sistemaAmigoApp.membership.home.search')}
                  />
                  <Button className="input-group-addon">
                    <FontAwesomeIcon icon="search" />
                  </Button>
                  <Button type="reset" className="input-group-addon" onClick={this.clear}>
                    <FontAwesomeIcon icon="trash" />
                  </Button>
                </InputGroup>
              </AvGroup>
            </AvForm>
          </Col>
        </Row>
        <div className="table-responsive">
          {membershipList && membershipList.length > 0 ? (
            <Table responsive aria-describedby="membership-heading">
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.membership.phone">Phone</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.membership.role">Role</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.membership.profilePicture">Profile Picture</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.membership.created">Created</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.membership.expires">Expires</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.membership.accountLevel">Account Level</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.membership.verified">Verified</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.membership.user">User</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.membership.employer">Employer</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {membershipList.map((membership, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${membership.id}`} color="link" size="sm">
                        {membership.id}
                      </Button>
                    </td>
                    <td>{membership.phone}</td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.MembershipRole.${membership.role}`} />
                    </td>
                    <td>
                      {membership.profilePicture ? (
                        <div>
                          <a onClick={openFile(membership.profilePictureContentType, membership.profilePicture)}>
                            <Translate contentKey="entity.action.open">Open</Translate>
                            &nbsp;
                          </a>
                          <span>
                            {membership.profilePictureContentType}, {byteSize(membership.profilePicture)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <TextFormat type="date" value={membership.created} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      <TextFormat type="date" value={membership.expires} format={APP_LOCAL_DATE_FORMAT} />
                    </td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.MembershipLevelType.${membership.accountLevel}`} />
                    </td>
                    <td>{membership.verified ? 'true' : 'false'}</td>
                    <td>{membership.user ? membership.user.email : ''}</td>
                    <td>
                      {membership.employer ? <Link to={`company/${membership.employer.id}`}>{membership.employer.legalName}</Link> : ''}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${membership.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${membership.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${membership.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">
              <Translate contentKey="sistemaAmigoApp.membership.home.notFound">No Memberships found</Translate>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ membership }: IRootState) => ({
  membershipList: membership.entities
});

const mapDispatchToProps = {
  getSearchEntities,
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Membership);
