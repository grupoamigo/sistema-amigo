import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { openFile, byteSize, Translate, translate, ICrudSearchAction, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './service-quote.reducer';
import { IServiceQuote } from 'app/shared/model/service-quote.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IServiceQuoteProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IServiceQuoteState {
  search: string;
}

export class ServiceQuote extends React.Component<IServiceQuoteProps, IServiceQuoteState> {
  state: IServiceQuoteState = {
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
    const { serviceQuoteList, match } = this.props;
    return (
      <div>
        <h2 id="service-quote-heading">
          <Translate contentKey="sistemaAmigoApp.serviceQuote.home.title">Service Quotes</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="sistemaAmigoApp.serviceQuote.home.createLabel">Create a new Service Quote</Translate>
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
                    placeholder={translate('sistemaAmigoApp.serviceQuote.home.search')}
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
          {serviceQuoteList && serviceQuoteList.length > 0 ? (
            <Table responsive aria-describedby="service-quote-heading">
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.title">Title</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.description">Description</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.quantity">Quantity</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.price">Price</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.unit">Unit</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.expeditionDate">Expedition Date</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.expirationDate">Expiration Date</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.status">Status</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.currency">Currency</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.approvedBy">Approved By</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.qrCode">Qr Code</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.serviceQuote.contract">Contract</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {serviceQuoteList.map((serviceQuote, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${serviceQuote.id}`} color="link" size="sm">
                        {serviceQuote.id}
                      </Button>
                    </td>
                    <td>{serviceQuote.title}</td>
                    <td>{serviceQuote.description}</td>
                    <td>{serviceQuote.quantity}</td>
                    <td>{serviceQuote.price}</td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.ServiceUnitType.${serviceQuote.unit}`} />
                    </td>
                    <td>
                      <TextFormat type="date" value={serviceQuote.expeditionDate} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      <TextFormat type="date" value={serviceQuote.expirationDate} format={APP_LOCAL_DATE_FORMAT} />
                    </td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.StatusType.${serviceQuote.status}`} />
                    </td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.CurrencyType.${serviceQuote.currency}`} />
                    </td>
                    <td>{serviceQuote.approvedBy}</td>
                    <td>
                      {serviceQuote.qrCode ? (
                        <div>
                          <a onClick={openFile(serviceQuote.qrCodeContentType, serviceQuote.qrCode)}>
                            <img
                              src={`data:${serviceQuote.qrCodeContentType};base64,${serviceQuote.qrCode}`}
                              style={{ maxHeight: '30px' }}
                            />
                            &nbsp;
                          </a>
                          <span>
                            {serviceQuote.qrCodeContentType}, {byteSize(serviceQuote.qrCode)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {serviceQuote.contract ? <Link to={`contract/${serviceQuote.contract.id}`}>{serviceQuote.contract.title}</Link> : ''}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${serviceQuote.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${serviceQuote.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${serviceQuote.id}/delete`} color="danger" size="sm">
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
              <Translate contentKey="sistemaAmigoApp.serviceQuote.home.notFound">No Service Quotes found</Translate>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ serviceQuote }: IRootState) => ({
  serviceQuoteList: serviceQuote.entities
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
)(ServiceQuote);
