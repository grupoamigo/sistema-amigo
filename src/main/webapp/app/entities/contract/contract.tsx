import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, InputGroup, Col, Row, Table } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { openFile, byteSize, Translate, translate, ICrudSearchAction, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getSearchEntities, getEntities } from './contract.reducer';
import { IContract } from 'app/shared/model/contract.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IContractProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export interface IContractState {
  search: string;
}

export class Contract extends React.Component<IContractProps, IContractState> {
  state: IContractState = {
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
    const { contractList, match } = this.props;
    return (
      <div>
        <h2 id="contract-heading">
          <Translate contentKey="sistemaAmigoApp.contract.home.title">Contracts</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="sistemaAmigoApp.contract.home.createLabel">Create a new Contract</Translate>
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
                    placeholder={translate('sistemaAmigoApp.contract.home.search')}
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
          {contractList && contractList.length > 0 ? (
            <Table responsive aria-describedby="contract-heading">
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="global.field.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.type">Type</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.title">Title</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.legalProse">Legal Prose</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.signature">Signature</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.contractFile">Contract File</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.qrCode">Qr Code</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.digitalFingerprint">Digital Fingerprint</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.dateSigned">Date Signed</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.expirationDate">Expiration Date</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.status">Status</Translate>
                  </th>
                  <th>
                    <Translate contentKey="sistemaAmigoApp.contract.companies">Companies</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {contractList.map((contract, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${contract.id}`} color="link" size="sm">
                        {contract.id}
                      </Button>
                    </td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.ContractType.${contract.type}`} />
                    </td>
                    <td>{contract.title}</td>
                    <td>{contract.legalProse}</td>
                    <td>
                      {contract.signature ? (
                        <div>
                          <a onClick={openFile(contract.signatureContentType, contract.signature)}>
                            <img src={`data:${contract.signatureContentType};base64,${contract.signature}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                          <span>
                            {contract.signatureContentType}, {byteSize(contract.signature)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {contract.contractFile ? (
                        <div>
                          <a onClick={openFile(contract.contractFileContentType, contract.contractFile)}>
                            <Translate contentKey="entity.action.open">Open</Translate>
                            &nbsp;
                          </a>
                          <span>
                            {contract.contractFileContentType}, {byteSize(contract.contractFile)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {contract.qrCode ? (
                        <div>
                          <a onClick={openFile(contract.qrCodeContentType, contract.qrCode)}>
                            <img src={`data:${contract.qrCodeContentType};base64,${contract.qrCode}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                          <span>
                            {contract.qrCodeContentType}, {byteSize(contract.qrCode)}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td>{contract.digitalFingerprint}</td>
                    <td>
                      <TextFormat type="date" value={contract.dateSigned} format={APP_DATE_FORMAT} />
                    </td>
                    <td>
                      <TextFormat type="date" value={contract.expirationDate} format={APP_LOCAL_DATE_FORMAT} />
                    </td>
                    <td>
                      <Translate contentKey={`sistemaAmigoApp.ContractStatusType.${contract.status}`} />
                    </td>
                    <td>{contract.companies ? <Link to={`company/${contract.companies.id}`}>{contract.companies.legalName}</Link> : ''}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${contract.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${contract.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${contract.id}/delete`} color="danger" size="sm">
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
              <Translate contentKey="sistemaAmigoApp.contract.home.notFound">No Contracts found</Translate>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ contract }: IRootState) => ({
  contractList: contract.entities
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
)(Contract);
