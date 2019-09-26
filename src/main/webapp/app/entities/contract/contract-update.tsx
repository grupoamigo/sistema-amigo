import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IServiceQuote } from 'app/shared/model/service-quote.model';
import { getEntities as getServiceQuotes } from 'app/entities/service-quote/service-quote.reducer';
import { ICompany } from 'app/shared/model/company.model';
import { getEntities as getCompanies } from 'app/entities/company/company.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './contract.reducer';
import { IContract } from 'app/shared/model/contract.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IContractUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IContractUpdateState {
  isNew: boolean;
  serviceQuoteId: string;
  companiesId: string;
}

export class ContractUpdate extends React.Component<IContractUpdateProps, IContractUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      serviceQuoteId: '0',
      companiesId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getServiceQuotes();
    this.props.getCompanies();
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    values.dateSigned = convertDateTimeToServer(values.dateSigned);

    if (errors.length === 0) {
      const { contractEntity } = this.props;
      const entity = {
        ...contractEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/contract');
  };

  render() {
    const { contractEntity, serviceQuotes, companies, loading, updating } = this.props;
    const { isNew } = this.state;

    const { signature, signatureContentType, contractFile, contractFileContentType, qrCode, qrCodeContentType } = contractEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.contract.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.contract.home.createOrEditLabel">Create or edit a Contract</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : contractEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="contract-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="contract-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="typeLabel" for="contract-type">
                    <Translate contentKey="sistemaAmigoApp.contract.type">Type</Translate>
                  </Label>
                  <AvInput
                    id="contract-type"
                    type="select"
                    className="form-control"
                    name="type"
                    value={(!isNew && contractEntity.type) || 'PRESTACION_DE_SERVICIO'}
                  >
                    <option value="PRESTACION_DE_SERVICIO">{translate('sistemaAmigoApp.ContractType.PRESTACION_DE_SERVICIO')}</option>
                    <option value="TERMINOS_Y_CONDICIONES">{translate('sistemaAmigoApp.ContractType.TERMINOS_Y_CONDICIONES')}</option>
                    <option value="DECISION_INTERNA">{translate('sistemaAmigoApp.ContractType.DECISION_INTERNA')}</option>
                    <option value="SOLICITUD_DE_SERVICIO">{translate('sistemaAmigoApp.ContractType.SOLICITUD_DE_SERVICIO')}</option>
                    <option value="SOLICITU_DE_MANIOBRA">{translate('sistemaAmigoApp.ContractType.SOLICITU_DE_MANIOBRA')}</option>
                    <option value="INSPECCION">{translate('sistemaAmigoApp.ContractType.INSPECCION')}</option>
                    <option value="EMPLEADO">{translate('sistemaAmigoApp.ContractType.EMPLEADO')}</option>
                    <option value="CONFIDENCIALIDAD">{translate('sistemaAmigoApp.ContractType.CONFIDENCIALIDAD')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="titleLabel" for="contract-title">
                    <Translate contentKey="sistemaAmigoApp.contract.title">Title</Translate>
                  </Label>
                  <AvField
                    id="contract-title"
                    type="text"
                    name="title"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="legalProseLabel" for="contract-legalProse">
                    <Translate contentKey="sistemaAmigoApp.contract.legalProse">Legal Prose</Translate>
                  </Label>
                  <AvField
                    id="contract-legalProse"
                    type="text"
                    name="legalProse"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="signatureLabel" for="signature">
                      <Translate contentKey="sistemaAmigoApp.contract.signature">Signature</Translate>
                    </Label>
                    <br />
                    {signature ? (
                      <div>
                        <a onClick={openFile(signatureContentType, signature)}>
                          <img src={`data:${signatureContentType};base64,${signature}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {signatureContentType}, {byteSize(signature)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('signature')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_signature" type="file" onChange={this.onBlobChange(true, 'signature')} accept="image/*" />
                    <AvInput type="hidden" name="signature" value={signature} />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="contractFileLabel" for="contractFile">
                      <Translate contentKey="sistemaAmigoApp.contract.contractFile">Contract File</Translate>
                    </Label>
                    <br />
                    {contractFile ? (
                      <div>
                        <a onClick={openFile(contractFileContentType, contractFile)}>
                          <Translate contentKey="entity.action.open">Open</Translate>
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {contractFileContentType}, {byteSize(contractFile)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('contractFile')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_contractFile" type="file" onChange={this.onBlobChange(false, 'contractFile')} />
                    <AvInput type="hidden" name="contractFile" value={contractFile} />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="qrCodeLabel" for="qrCode">
                      <Translate contentKey="sistemaAmigoApp.contract.qrCode">Qr Code</Translate>
                    </Label>
                    <br />
                    {qrCode ? (
                      <div>
                        <a onClick={openFile(qrCodeContentType, qrCode)}>
                          <img src={`data:${qrCodeContentType};base64,${qrCode}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {qrCodeContentType}, {byteSize(qrCode)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('qrCode')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_qrCode" type="file" onChange={this.onBlobChange(true, 'qrCode')} accept="image/*" />
                    <AvInput type="hidden" name="qrCode" value={qrCode} />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <Label id="digitalFingerprintLabel" for="contract-digitalFingerprint">
                    <Translate contentKey="sistemaAmigoApp.contract.digitalFingerprint">Digital Fingerprint</Translate>
                  </Label>
                  <AvField id="contract-digitalFingerprint" type="text" name="digitalFingerprint" />
                </AvGroup>
                <AvGroup>
                  <Label id="dateSignedLabel" for="contract-dateSigned">
                    <Translate contentKey="sistemaAmigoApp.contract.dateSigned">Date Signed</Translate>
                  </Label>
                  <AvInput
                    id="contract-dateSigned"
                    type="datetime-local"
                    className="form-control"
                    name="dateSigned"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? null : convertDateTimeFromServer(this.props.contractEntity.dateSigned)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="expirationDateLabel" for="contract-expirationDate">
                    <Translate contentKey="sistemaAmigoApp.contract.expirationDate">Expiration Date</Translate>
                  </Label>
                  <AvField id="contract-expirationDate" type="date" className="form-control" name="expirationDate" />
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel" for="contract-status">
                    <Translate contentKey="sistemaAmigoApp.contract.status">Status</Translate>
                  </Label>
                  <AvInput
                    id="contract-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && contractEntity.status) || 'EMITIDO'}
                  >
                    <option value="EMITIDO">{translate('sistemaAmigoApp.ContractStatusType.EMITIDO')}</option>
                    <option value="FIRMADO">{translate('sistemaAmigoApp.ContractStatusType.FIRMADO')}</option>
                    <option value="ACTIVO">{translate('sistemaAmigoApp.ContractStatusType.ACTIVO')}</option>
                    <option value="CANCELADO">{translate('sistemaAmigoApp.ContractStatusType.CANCELADO')}</option>
                    <option value="PAUSADO">{translate('sistemaAmigoApp.ContractStatusType.PAUSADO')}</option>
                    <option value="TERMINADO">{translate('sistemaAmigoApp.ContractStatusType.TERMINADO')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="contract-companies">
                    <Translate contentKey="sistemaAmigoApp.contract.companies">Companies</Translate>
                  </Label>
                  <AvInput id="contract-companies" type="select" className="form-control" name="companies.id">
                    <option value="" key="0" />
                    {companies
                      ? companies.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.legalName}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/contract" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  serviceQuotes: storeState.serviceQuote.entities,
  companies: storeState.company.entities,
  contractEntity: storeState.contract.entity,
  loading: storeState.contract.loading,
  updating: storeState.contract.updating,
  updateSuccess: storeState.contract.updateSuccess
});

const mapDispatchToProps = {
  getServiceQuotes,
  getCompanies,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractUpdate);
