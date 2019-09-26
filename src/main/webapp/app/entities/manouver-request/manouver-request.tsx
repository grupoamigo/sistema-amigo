import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { openFile, byteSize, Translate, translate, ICrudSearchAction, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './manouver-request.reducer';
import { IManouverRequest } from 'app/shared/model/manouver-request.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IManouverRequestProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IManouverRequestState {
  search: string;
}

export class ManouverRequest extends React.Component<IManouverRequestProps, IManouverRequestState> {
  state: IManouverRequestState = {
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
    const { manouverRequestList, match } = this.props;
    return (
      <div>
        <h2 id="manouver-request-heading">
          <Translate contentKey="sistemaAmigoApp.manouverRequest.home.title">Manouver Requests</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="sistemaAmigoApp.manouverRequest.home.createLabel">Create a new Manouver Request</Translate>
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
                    placeholder={translate('sistemaAmigoApp.manouverRequest.home.search')}
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
          {manouverRequestList && manouverRequestList.length > 0 ? (
            <Table responsive aria-describedby="manouver-request-heading">
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.title">Title</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.description">Description</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.date">Date</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.transportType">Transport Type</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.qrCode">Qr Code</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.origin">Origin</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.destiny">Destiny</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.manouverRequest.manouver">Manouver</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {manouverRequestList.map((manouverRequest, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${manouverRequest.id}`} color="link" size="sm">
                        {manouverRequest.id}
                      </Button>
                    </td>
                    <td>{manouverRequest.title}</td>
                    <td>{manouverRequest.description}</td>
                    <td>
                      <TextFormat type="date" value={manouverRequest.date} format={APP_LOCAL_DATE_FORMAT} />
                    </td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.TransportType.${manouverRequest.transportType}`} />
                    </td>
                    <td>
                      {manouverRequest.qrCode ? (
                        <div>
                          <a onClick={openFile(manouverRequest.qrCodeContentType, manouverRequest.qrCode)}>
                            <img
                              src={`data:${manouverRequest.qrCodeContentType};base64,${manouverRequest.qrCode}`}
                              style={{ maxHeight: '30px' }}
                            />
                            &nbsp;
                          </a>
                          <span>
                            {manouverRequest.qrCodeContentType}, {byteSize(manouverRequest.qrCode)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {manouverRequest.origin ? (
                        <Link to={`location/${manouverRequest.origin.id}`}>{manouverRequest.origin.address}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td>
                      {manouverRequest.destiny ? (
                        <Link to={`location/${manouverRequest.destiny.id}`}>{manouverRequest.destiny.address}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td>
                      {manouverRequest.manouver ? (
                        <Link to={`manouver/${manouverRequest.manouver.id}`}>{manouverRequest.manouver.title}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${manouverRequest.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${manouverRequest.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${manouverRequest.id}/delete`} color="danger" size="sm">
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
              <Translate contentKey="sistemaAmigoApp.manouverRequest.home.notFound">No Manouver Requests found</Translate>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ manouverRequest }: IRootState) => ({
  manouverRequestList: manouverRequest.entities
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
)(ManouverRequest);
