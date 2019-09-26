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
import { IManouverRequest } from 'app/shared/model/manouver-request.model';
import { getEntities as getManouverRequests } from 'app/entities/manouver-request/manouver-request.reducer';
import { getEntity, updateEntity, createEntity, reset } from './manouver.reducer';
import { IManouver } from 'app/shared/model/manouver.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IManouverUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IManouverUpdateState {
  isNew: boolean;
  providerId: string;
  manouverRequestId: string;
}

export class ManouverUpdate extends React.Component<IManouverUpdateProps, IManouverUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      providerId: '0',
      manouverRequestId: '0',
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
    this.props.getManouverRequests();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { manouverEntity } = this.props;
      const entity = {
        ...manouverEntity,
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
    this.props.history.push('/entity/manouver');
  };

  render() {
    const { manouverEntity, companies, manouverRequests, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.manouver.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.manouver.home.createOrEditLabel">Create or edit a Manouver</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : manouverEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="manouver-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="manouver-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="titleLabel" for="manouver-title">
                    <Translate contentKey="sistemaAmigoApp.manouver.title">Title</Translate>
                  </Label>
                  <AvField
                    id="manouver-title"
                    type="text"
                    name="title"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="manouver-description">
                    <Translate contentKey="sistemaAmigoApp.manouver.description">Description</Translate>
                  </Label>
                  <AvField
                    id="manouver-description"
                    type="text"
                    name="description"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="unitLabel" for="manouver-unit">
                    <Translate contentKey="sistemaAmigoApp.manouver.unit">Unit</Translate>
                  </Label>
                  <AvInput
                    id="manouver-unit"
                    type="select"
                    className="form-control"
                    name="unit"
                    value={(!isNew && manouverEntity.unit) || 'TM'}
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
                  <Label id="divisionLabel" for="manouver-division">
                    <Translate contentKey="sistemaAmigoApp.manouver.division">Division</Translate>
                  </Label>
                  <AvInput
                    id="manouver-division"
                    type="select"
                    className="form-control"
                    name="division"
                    value={(!isNew && manouverEntity.division) || 'INTERMODAL'}
                  >
                    <option value="INTERMODAL">{translate('sistemaAmigoApp.DivisionType.INTERMODAL')}</option>
                    <option value="FERTILIZANTES">{translate('sistemaAmigoApp.DivisionType.FERTILIZANTES')}</option>
                    <option value="POLIETILENO">{translate('sistemaAmigoApp.DivisionType.POLIETILENO')}</option>
                    <option value="TUBERIA">{translate('sistemaAmigoApp.DivisionType.TUBERIA')}</option>
                    <option value="LACTEOS">{translate('sistemaAmigoApp.DivisionType.LACTEOS')}</option>
                    <option value="CERVEZA">{translate('sistemaAmigoApp.DivisionType.CERVEZA')}</option>
                    <option value="SAGARPA">{translate('sistemaAmigoApp.DivisionType.SAGARPA')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="priceLabel" for="manouver-price">
                    <Translate contentKey="sistemaAmigoApp.manouver.price">Price</Translate>
                  </Label>
                  <AvField id="manouver-price" type="string" className="form-control" name="price" />
                </AvGroup>
                <AvGroup>
                  <Label id="currencyLabel" for="manouver-currency">
                    <Translate contentKey="sistemaAmigoApp.manouver.currency">Currency</Translate>
                  </Label>
                  <AvInput
                    id="manouver-currency"
                    type="select"
                    className="form-control"
                    name="currency"
                    value={(!isNew && manouverEntity.currency) || 'MXN'}
                  >
                    <option value="MXN">{translate('sistemaAmigoApp.CurrencyType.MXN')}</option>
                    <option value="USD">{translate('sistemaAmigoApp.CurrencyType.USD')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="manouver-provider">
                    <Translate contentKey="sistemaAmigoApp.manouver.provider">Provider</Translate>
                  </Label>
                  <AvInput id="manouver-provider" type="select" className="form-control" name="provider.id">
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
                <Button tag={Link} id="cancel-save" to="/entity/manouver" replace color="info">
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
  manouverRequests: storeState.manouverRequest.entities,
  manouverEntity: storeState.manouver.entity,
  loading: storeState.manouver.loading,
  updating: storeState.manouver.updating,
  updateSuccess: storeState.manouver.updateSuccess
});

const mapDispatchToProps = {
  getCompanies,
  getManouverRequests,
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
)(ManouverUpdate);
