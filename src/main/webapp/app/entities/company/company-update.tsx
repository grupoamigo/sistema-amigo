import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IService } from 'app/shared/model/service.model';
import { getEntities as getServices } from 'app/entities/service/service.reducer';
import { IWarehouse } from 'app/shared/model/warehouse.model';
import { getEntities as getWarehouses } from 'app/entities/warehouse/warehouse.reducer';
import { IManouver } from 'app/shared/model/manouver.model';
import { getEntities as getManouvers } from 'app/entities/manouver/manouver.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './company.reducer';
import { ICompany } from 'app/shared/model/company.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ICompanyUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ICompanyUpdateState {
  isNew: boolean;
  serviceId: string;
  warehouseId: string;
  manouverId: string;
}

export class CompanyUpdate extends React.Component<ICompanyUpdateProps, ICompanyUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      serviceId: '0',
      warehouseId: '0',
      manouverId: '0',
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

    this.props.getServices();
    this.props.getWarehouses();
    this.props.getManouvers();
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { companyEntity } = this.props;
      const entity = {
        ...companyEntity,
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
    this.props.history.push('/entity/company');
  };

  render() {
    const { companyEntity, services, warehouses, manouvers, loading, updating } = this.props;
    const { isNew } = this.state;

    const { logo, logoContentType, profilePicture, profilePictureContentType } = companyEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.company.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.company.home.createOrEditLabel">Create or edit a Company</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : companyEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="company-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="company-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="legalNameLabel" for="company-legalName">
                    <Translate contentKey="sistemaAmigoApp.company.legalName">Legal Name</Translate>
                  </Label>
                  <AvField
                    id="company-legalName"
                    type="text"
                    name="legalName"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="taxIdLabel" for="company-taxId">
                    <Translate contentKey="sistemaAmigoApp.company.taxId">Tax Id</Translate>
                  </Label>
                  <AvField
                    id="company-taxId"
                    type="text"
                    name="taxId"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="typeLabel" for="company-type">
                    <Translate contentKey="sistemaAmigoApp.company.type">Type</Translate>
                  </Label>
                  <AvInput
                    id="company-type"
                    type="select"
                    className="form-control"
                    name="type"
                    value={(!isNew && companyEntity.type) || 'NAVIERA'}
                  >
                    <option value="NAVIERA">{translate('sistemaAmigoApp.CompanyType.NAVIERA')}</option>
                    <option value="TRANSPORTISTA">{translate('sistemaAmigoApp.CompanyType.TRANSPORTISTA')}</option>
                    <option value="PERSONA_MORAL">{translate('sistemaAmigoApp.CompanyType.PERSONA_MORAL')}</option>
                    <option value="PERSONA_FISICA">{translate('sistemaAmigoApp.CompanyType.PERSONA_FISICA')}</option>
                    <option value="CONTRATISTA">{translate('sistemaAmigoApp.CompanyType.CONTRATISTA')}</option>
                    <option value="AGENTE_ADUANAL">{translate('sistemaAmigoApp.CompanyType.AGENTE_ADUANAL')}</option>
                    <option value="GOBIERNO">{translate('sistemaAmigoApp.CompanyType.GOBIERNO')}</option>
                    <option value="CENTRO_DE_DISTRIBUCION">{translate('sistemaAmigoApp.CompanyType.CENTRO_DE_DISTRIBUCION')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="logoLabel" for="logo">
                      <Translate contentKey="sistemaAmigoApp.company.logo">Logo</Translate>
                    </Label>
                    <br />
                    {logo ? (
                      <div>
                        <a onClick={openFile(logoContentType, logo)}>
                          <img src={`data:${logoContentType};base64,${logo}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {logoContentType}, {byteSize(logo)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('logo')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_logo" type="file" onChange={this.onBlobChange(true, 'logo')} accept="image/*" />
                    <AvInput type="hidden" name="logo" value={logo} />
                  </AvGroup>
                </AvGroup>
                <AvGroup>
                  <AvGroup>
                    <Label id="profilePictureLabel" for="profilePicture">
                      <Translate contentKey="sistemaAmigoApp.company.profilePicture">Profile Picture</Translate>
                    </Label>
                    <br />
                    {profilePicture ? (
                      <div>
                        <a onClick={openFile(profilePictureContentType, profilePicture)}>
                          <img src={`data:${profilePictureContentType};base64,${profilePicture}`} style={{ maxHeight: '100px' }} />
                        </a>
                        <br />
                        <Row>
                          <Col md="11">
                            <span>
                              {profilePictureContentType}, {byteSize(profilePicture)}
                            </span>
                          </Col>
                          <Col md="1">
                            <Button color="danger" onClick={this.clearBlob('profilePicture')}>
                              <FontAwesomeIcon icon="times-circle" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <input id="file_profilePicture" type="file" onChange={this.onBlobChange(true, 'profilePicture')} accept="image/*" />
                    <AvInput type="hidden" name="profilePicture" value={profilePicture} />
                  </AvGroup>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/company" replace color="info">
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
  services: storeState.service.entities,
  warehouses: storeState.warehouse.entities,
  manouvers: storeState.manouver.entities,
  companyEntity: storeState.company.entity,
  loading: storeState.company.loading,
  updating: storeState.company.updating,
  updateSuccess: storeState.company.updateSuccess
});

const mapDispatchToProps = {
  getServices,
  getWarehouses,
  getManouvers,
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
)(CompanyUpdate);
