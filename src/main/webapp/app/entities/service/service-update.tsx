import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ICompany } from 'app/shared/model/company.model';
import { getEntities as getCompanies } from 'app/entities/company/company.reducer';
import { getEntity, updateEntity, createEntity, reset } from './service.reducer';
import { IService } from 'app/shared/model/service.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IServiceUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IServiceUpdateState {
  isNew: boolean;
  companyId: string;
}

export class ServiceUpdate extends React.Component<IServiceUpdateProps, IServiceUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '0',
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

    this.props.getCompanies();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { serviceEntity } = this.props;
      const entity = {
        ...serviceEntity,
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
    this.props.history.push('/entity/service');
  };

  render() {
    const { serviceEntity, companies, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.service.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.service.home.createOrEditLabel">Create or edit a Service</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : serviceEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="service-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="service-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="titleLabel" for="service-title">
                    <Translate contentKey="sistemaAmigoApp.service.title">Title</Translate>
                  </Label>
                  <AvField
                    id="service-title"
                    type="text"
                    name="title"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="service-description">
                    <Translate contentKey="sistemaAmigoApp.service.description">Description</Translate>
                  </Label>
                  <AvField
                    id="service-description"
                    type="text"
                    name="description"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="typeLabel" for="service-type">
                    <Translate contentKey="sistemaAmigoApp.service.type">Type</Translate>
                  </Label>
                  <AvInput
                    id="service-type"
                    type="select"
                    className="form-control"
                    name="type"
                    value={(!isNew && serviceEntity.type) || 'CARGA'}
                  >
                    <option value="CARGA">{translate('sistemaAmigoApp.ServiceType.CARGA')}</option>
                    <option value="DESCARGA">{translate('sistemaAmigoApp.ServiceType.DESCARGA')}</option>
                    <option value="TRANSPORTE">{translate('sistemaAmigoApp.ServiceType.TRANSPORTE')}</option>
                    <option value="IMPORTACION">{translate('sistemaAmigoApp.ServiceType.IMPORTACION')}</option>
                    <option value="EXPORTACION">{translate('sistemaAmigoApp.ServiceType.EXPORTACION')}</option>
                    <option value="ALMACENAJE">{translate('sistemaAmigoApp.ServiceType.ALMACENAJE')}</option>
                    <option value="INSPECCION">{translate('sistemaAmigoApp.ServiceType.INSPECCION')}</option>
                    <option value="REPARACION">{translate('sistemaAmigoApp.ServiceType.REPARACION')}</option>
                    <option value="CROSS_DOCK">{translate('sistemaAmigoApp.ServiceType.CROSS_DOCK')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="unitLabel" for="service-unit">
                    <Translate contentKey="sistemaAmigoApp.service.unit">Unit</Translate>
                  </Label>
                  <AvInput
                    id="service-unit"
                    type="select"
                    className="form-control"
                    name="unit"
                    value={(!isNew && serviceEntity.unit) || 'TM'}
                  >
                    <option value="TM">{translate('sistemaAmigoApp.ServiceUnitType.TM')}</option>
                    <option value="KG">{translate('sistemaAmigoApp.ServiceUnitType.KG')}</option>
                    <option value="CONTENEDOR_20TM">{translate('sistemaAmigoApp.ServiceUnitType.CONTENEDOR_20TM')}</option>
                    <option value="CONTENEDOR_40TM">{translate('sistemaAmigoApp.ServiceUnitType.CONTENEDOR_40TM')}</option>
                    <option value="M2">{translate('sistemaAmigoApp.ServiceUnitType.M2')}</option>
                    <option value="TARIMA">{translate('sistemaAmigoApp.ServiceUnitType.TARIMA')}</option>
                    <option value="KM">{translate('sistemaAmigoApp.ServiceUnitType.KM')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel" for="service-status">
                    <Translate contentKey="sistemaAmigoApp.service.status">Status</Translate>
                  </Label>
                  <AvInput
                    id="service-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && serviceEntity.status) || 'PROCESANDO'}
                  >
                    <option value="PROCESANDO">{translate('sistemaAmigoApp.StatusType.PROCESANDO')}</option>
                    <option value="CONFIRMADO">{translate('sistemaAmigoApp.StatusType.CONFIRMADO')}</option>
                    <option value="ACTIVO">{translate('sistemaAmigoApp.StatusType.ACTIVO')}</option>
                    <option value="EN_ESPERA">{translate('sistemaAmigoApp.StatusType.EN_ESPERA')}</option>
                    <option value="TERMINADO">{translate('sistemaAmigoApp.StatusType.TERMINADO')}</option>
                    <option value="CANCELADO">{translate('sistemaAmigoApp.StatusType.CANCELADO')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="service-company">
                    <Translate contentKey="sistemaAmigoApp.service.company">Company</Translate>
                  </Label>
                  <AvInput id="service-company" type="select" className="form-control" name="company.id">
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
                <Button tag={Link} id="cancel-save" to="/entity/service" replace color="info">
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
  companies: storeState.company.entities,
  serviceEntity: storeState.service.entity,
  loading: storeState.service.loading,
  updating: storeState.service.updating,
  updateSuccess: storeState.service.updateSuccess
});

const mapDispatchToProps = {
  getCompanies,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceUpdate);
